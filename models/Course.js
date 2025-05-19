const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    maxStudents: Number,
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tokenId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
