const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    if (req.user.role !== 'instructor')
        return res.status(403).json({ msg: 'Only instructors can create courses' });

    const { title, description, maxStudents } = req.body;

    try {
        const newCourse = await Course.create({
            title,
            description,
            maxStudents,
            instructorId: req.user._id,
        });

        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to create course' });
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

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().lean(); // lean() for plain JS objects

        // If token exists and user is a student
        let enrolledCourses = [];

        if (req.user && req.user.role === 'student') {
            const enrollments = await Enrollment.find({ userId: req.user._id }).select('courseId');
            enrolledCourses = enrollments.map(e => e.courseId.toString());
        }

        // Mark enrolled status per course
        const result = courses.map(course => ({
            ...course,
            enrolled: enrolledCourses.includes(course._id.toString())
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch courses' });
    }
};