const Cart = require('../models/Cart');  // Import the Cart model

const updateItemQuantity = async (user, itemId, action) => {
    const numericItemId = Number(itemId);

    // Find the cart item by userId and itemId
    const cartItem = await Cart.findOne({
        where: {
            UserId: user.id,  // Change this to "UserId"
            ItemId: numericItemId,  // Change this to "ItemId"
        },
    });
    
    // Check if the item exists in the cart
    if (!cartItem) {
        throw new Error('Item not found in cart');
    }

    let newQuantity = cartItem.quantity;

    // Adjust the quantity based on the action
    if (action === 'increase') {
        newQuantity += 1;
    } else if (action === 'decrease' && newQuantity > 1) {
        newQuantity -= 1;
    } else if (action === 'decrease' && newQuantity === 1) {
        throw new Error('Quantity cannot be less than 1');
    }

    // Update the quantity directly in the cart
    await cartItem.update({ quantity: newQuantity });

    return newQuantity;
};

module.exports = { updateItemQuantity };
