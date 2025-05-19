const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    const { title, description, maxStudents } = req.body;

    try {
        const tokenId = await createCourseNFTCollection(title);

        const newCourse = await Course.create({
            title,
            description,
            maxStudents,
            instructorId: req.user._id,
            tokenId // 👈 Save it here
        });

        res.status(201).json(newCourse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Course creation failed" });
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructorId: req.user._id });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch courses' });
    }
};


const Enrollment = require('../models/Enrollment');
const { createCourseNFTCollection } = require('../services/hederaService');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().lean();

        let enrolledCourses = [];

        if (req.user && req.user.role === 'student') {
            const enrollments = await Enrollment.find({ userId: req.user._id }).select('courseId');
            enrolledCourses = enrollments.map(e => e.courseId.toString());
        }

        const result = courses.map(course => ({
            ...course,
            enrolled: enrolledCourses.includes(course._id.toString()),
            tokenId: course.tokenId  // Include tokenId explicitly
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch courses' });
    }
};