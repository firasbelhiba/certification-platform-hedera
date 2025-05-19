const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createCourse, getMyCourses, getAllCourses } = require('../controllers/courseController');
const authOptional = require('../middleware/authOptional');

router.post('/', auth, createCourse);
router.get('/my', auth, getMyCourses);
router.get('/', authOptional, getAllCourses); 


module.exports = router;
