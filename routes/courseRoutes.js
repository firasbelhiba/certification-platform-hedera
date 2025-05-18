const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createCourse, getMyCourses, getAllCourses } = require('../controllers/courseController');

router.post('/', auth, createCourse);
router.get('/my', auth, getMyCourses);
router.get('/', getAllCourses);


module.exports = router;
