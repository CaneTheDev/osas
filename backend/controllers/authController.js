// Path: backend/controllers/authController.js

const authService = require('../services/authService');

// Controller for user sign-up
exports.signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Call service to register user
        const user = await authService.registerUser(fullname, email, password);

        res.status(201).json({ message: 'User registered successfully!', user });
    } catch (error) {
        if (error.message.includes('duplicate key')) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        
        
        res.status(500).json({ message: error.message });
    }
};


// Controller for user sign-in
// Controller for user sign-in
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Store user data in the session
        req.session.user = {
            id: user.id,
            fullname: user.fullname,
            email: user.email
        };

        res.status(200).json({ message: 'Sign-in successful!', user: req.session.user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Path: backend/controllers/authController.js
exports.getUsername = (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ username: req.session.user.fullname });
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
};

// Controller for user sign-out
exports.signout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to sign out' });
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            return res.status(200).json({ message: 'Sign-out successful' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
