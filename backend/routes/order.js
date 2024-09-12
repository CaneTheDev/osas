const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/place', orderController.placeOrder);
// New route for fetching all orders
router.get('/all', orderController.getAllOrders);
// Add this route to your order.js
router.get('/last-order', orderController.getLastOrder);
// Route to fetch orders for the logged-in user
router.get('/my-orders', orderController.getUserOrders);


// Route for confirming an order
router.post('/:id/confirm', orderController.confirmOrder);
// Route for canceling an order
router.post('/:id/cancel', orderController.cancelOrder);


// Add this route to fetch a specific order by ID
router.get('/:id', orderController.getOrderById);

module.exports = router;
