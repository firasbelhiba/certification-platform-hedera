const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { enrollInCourse, getMyEnrollments } = require('../controllers/enrollmentController');

router.post('/:id/enroll', auth, enrollInCourse);
router.get('/my', auth, getMyEnrollments);

module.exports = router;
