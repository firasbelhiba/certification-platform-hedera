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


exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch courses' });
    }
};