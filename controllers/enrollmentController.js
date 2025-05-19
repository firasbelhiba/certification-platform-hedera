const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { mintCertificateNFT } = require('../services/hederaService'); // We'll create this
const User = require('../models/User');
const { uploadMetadataToIPFS } = require('../services/ipfsService');

exports.enrollInCourse = async (req, res) => {
    const user = req.user;
    const { id: courseId } = req.params;

    if (user.role !== 'student') {
        return res.status(403).json({ msg: 'Only students can enroll' });
    }

    const alreadyEnrolled = await Enrollment.findOne({ userId: user._id, courseId });
    if (alreadyEnrolled) {
        return res.status(400).json({ msg: 'Already enrolled in this course' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    try {
        const enrollment = await Enrollment.create({
            userId: user._id,
            courseId
        });

        res.status(201).json({ msg: 'Enrolled successfully', enrollment });
    } catch (err) {
        res.status(500).json({ msg: 'Error enrolling in course' });
    }
};

exports.getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user._id }).populate('courseId');
        const courses = enrollments.map(e => ({
            title: e.courseId.title,
            description: e.courseId.description,
            enrolledAt: e.enrolledAt,
            completed: e.completed,
            nftIssued: e.nftIssued
        }));

        res.json(courses);
    } catch (err) {
        res.status(500).json({ msg: 'Could not fetch enrollments' });
    }
};

exports.markAsCompleted = async (req, res) => {
    const { studentId, courseId } = req.params;

    // Ensure instructor
    if (req.user.role !== 'instructor') {
        return res.status(403).json({ msg: 'Only instructors can issue certificates' });
    }

    // Validate enrollment
    const enrollment = await Enrollment.findOne({ userId: studentId, courseId });
    if (!enrollment) {
        return res.status(404).json({ msg: 'Enrollment not found' });
    }

    // Get student and course info
    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !student.hederaAccountId) {
        return res.status(400).json({ msg: 'Student has no Hedera account associated' });
    }

    if (!course || !course.tokenId) {
        return res.status(400).json({ msg: 'Course has no tokenId (NFT collection) assigned' });
    }

    // Upload certificate metadata to IPFS
    const metadataUrl = await uploadMetadataToIPFS({
        studentName: student.name,
        courseTitle: course.title,
        date: new Date().toISOString()
    });

    // Mint the NFT certificate
    const { tokenId, serialNumber } = await mintCertificateNFT(
        course.tokenId,              // Use token ID from course
        metadataUrl,
        student.hederaAccountId
    );

    // Update enrollment record
    enrollment.completed = true;
    enrollment.nftIssued = true;
    enrollment.tokenId = tokenId;
    enrollment.serialNumber = serialNumber;
    enrollment.certificateMetadataUrl = metadataUrl;
    await enrollment.save();

    res.status(200).json({
        msg: 'Certificate issued and NFT minted',
        metadataUrl,
        tokenId,
        serialNumber
    });
};
