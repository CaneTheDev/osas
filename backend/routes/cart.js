// backend/routes/cart.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route to add an item to the cart
router.post('/add', cartController.addItemToCart);

// Route to get a user's cart
router.get('/mycart', cartController.getUserCart);

// Route to remove an item from the cart
router.delete('/remove/:itemId', cartController.removeItemFromCart);

// **Add this route for updating item quantity**
router.post('/update-quantity', cartController.updateItemQuantity);

module.exports = router;
