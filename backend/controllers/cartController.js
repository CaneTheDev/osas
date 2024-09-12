const Cart = require('../models/Cart');
const Item = require('../models/Item');
const User = require('../models/User');
const cartService = require('../services/cartService');

// Add item to cart
exports.addItemToCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.session.user.id; // Assuming the user is logged in

        // Find the item and user
        const item = await Item.findByPk(itemId);
        const user = await User.findByPk(userId);

        // Add item to the user's cart
        await user.addItem(item, { through: { quantity } });

        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding the item to the cart' });
    }
};

// Get all items in the user's cart
exports.getUserCart = async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Fetch the user with associated cart items and quantity
        const user = await User.findByPk(userId, {
            include: {
                model: Item,
                as: 'Items',
                through: { attributes: ['quantity'] } // Include the quantity from the Cart model (join table)
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Map through the items to extract necessary fields including the quantity
        const items = user.Items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.imageUrl,
            quantity: item.Cart.quantity // Access the quantity from the join table
        }));

        res.status(200).json(items); // Return the items in the cart
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the cart' });
    }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.session.user.id;

        const user = await User.findByPk(userId);
        const item = await Item.findByPk(itemId);

        // Remove the item from the user's cart
        await user.removeItem(item);

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while removing the item from the cart' });
    }
};

// Update item quantity in cart
exports.updateItemQuantity = async (req, res) => {
    try {
        const { itemId, action } = req.body;
        const userId = req.session.user.id;

        const user = await User.findByPk(userId, {
            include: { model: Item, as: 'Items' }
        });

        const newQuantity = await cartService.updateItemQuantity(user, itemId, action);

        res.status(200).json({ message: 'Quantity updated', quantity: newQuantity });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the quantity' });
    }
};
