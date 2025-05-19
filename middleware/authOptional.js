const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authOptional = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next(); // proceed without user

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
        // Invalid token: still allow access as anonymous
        req.user = null;
    }
    next();
};

module.exports = authOptional;
