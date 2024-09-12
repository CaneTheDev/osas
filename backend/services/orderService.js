const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Item = require('../models/Item');

async function getOrdersByUserId(userId) {
    try {
        console.log(`Fetching orders for user with ID: ${userId}`);
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    include: [{ model: Item }]
                }
            ]
        });
        return orders;
    } catch (error) {
        console.error(`Error in getOrdersByUserId for userId: ${userId}`, error);
        throw error;
    }
}

module.exports = {
    getOrdersByUserId
};
//working