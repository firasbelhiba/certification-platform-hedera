const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    nftIssued: { type: Boolean, default: false }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
