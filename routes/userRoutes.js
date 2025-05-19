const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addHederaAccount } = require('../controllers/userController');

router.put('/hedera', auth, addHederaAccount);

module.exports = router;
