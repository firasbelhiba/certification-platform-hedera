const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

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
