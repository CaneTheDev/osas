// routes/item.js

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Routes for item management
router.post('/add', itemController.addItem);
router.get('/list', itemController.getAllItems);
router.put('/edit/:id', itemController.updateItem);
router.delete('/delete/:id', itemController.deleteItem);

// Route for fetching categories
router.get('/categories', itemController.getCategories);
router.get('/tags', itemController.getTags);

// Route to get items by tag
router.get('/tags/:tag', itemController.getItemsByTag);

// Route to search for items by name
router.get('/search', itemController.searchItems);

// Route to get an item by ID (with extra images if available)
router.get('/get/:id', itemController.getItemById);

// Route to get items by category
router.get('/items/category/:category', itemController.getItemsByCategory);

module.exports = router;
