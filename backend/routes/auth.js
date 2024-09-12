// Path: backend/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Sign-up route
router.post('/signup', authController.signup);

// Sign-in route
router.post('/signin', authController.signin);


// Route to get the logged-in user's username
router.get('/get-username', authController.getUsername);
// Route to sign out the user
router.post('/signout', authController.signout);


module.exports = router;
