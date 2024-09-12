const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Controller for Admin sign-in
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        req.session.admin = { id: admin.id, email: admin.email };
        res.status(200).json({ message: 'Sign-in successful!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller for Admin sign-out
exports.signout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to sign out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Sign-out successful' });
    });
};
