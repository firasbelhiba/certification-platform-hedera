const User = require('../models/User');

exports.addHederaAccount = async (req, res) => {
    const { hederaAccountId } = req.body;

    if (!hederaAccountId) {
        return res.status(400).json({ msg: 'hederaAccountId is required' });
    }

    try {
        const user = await User.findById(req.user._id);
        user.hederaAccountId = hederaAccountId;
        await user.save();
        res.status(200).json({ msg: 'Hedera account linked successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to update Hedera account' });
    }
};
