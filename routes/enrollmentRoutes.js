const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { enrollInCourse, getMyEnrollments, markAsCompleted } = require('../controllers/enrollmentController');

router.post('/:id/enroll', auth, enrollInCourse);
router.get('/my', auth, getMyEnrollments);

// Route to mark course as completed and mint certificate
router.post('/:courseId/complete/:studentId', auth, markAsCompleted);

module.exports = router;
