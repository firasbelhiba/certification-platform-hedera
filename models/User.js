const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['instructor', 'student'] },
    hederaAccountId: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
