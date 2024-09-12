const path = require('path');
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin authentication routes
router.post('/signin', adminAuthController.signin);
router.post('/signout', adminAuthController.signout);

// Protected admin routes
router.get('/dashboard', authMiddleware.isAdminAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/admindashboard.html'));
});

// Route to serve admin item management page
router.get('/items', authMiddleware.isAdminAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/adminitem.html'));
});
// Route to serve admin user order management page
router.get('/userorders', authMiddleware.isAdminAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/adminuserorder.html'));
});



module.exports = router;
