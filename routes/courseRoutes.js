const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createCourse, getMyCourses } = require('../controllers/courseController');

router.post('/', auth, createCourse);
router.get('/my', auth, getMyCourses);

module.exports = router;
