const path = require('path');
const express = require('express');
const router = express.Router();



// General User Routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/landing/home.html'));
});

router.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/shop/shop.html'));
});
router.get('/store', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/store/store.html'));
});


router.get('/our-products', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/our-products/our-products.html'));
});

router.get('/product-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/product-page/product-page.html'));
});

router.get('/contact-us', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/contact-Us/contact-Us.html'));
});

router.get('/about-us', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/about-Us/about-Us.html'));
});

router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/Auth/sign-in.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/Auth/sign-up.html'));
});

router.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/cart/cart.html'));
});

router.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/Check-out/check-out.html'));
});
// Serve complete page
router.get('/complete', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/complete/complete.html'));
});

router.get('/user-orders', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/user-orders/user-orders.html'));
});

// Serve the Admin Login Page
router.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/adminlogin.html'));
});
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/404/404.html'));
});

module.exports = router;
