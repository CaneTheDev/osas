const sequelize = require('../config/database'); // Import the sequelize instance
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const Item = require('../models/Item');
const orderService = require('../services/orderService'); // Import the service

exports.placeOrder = async (req, res) => {
    const userId = req.session.user.id;
    const { shippingOption, shippingDetails, pickUpDate } = req.body; // Capture pickUpDate

    const transaction = await sequelize.transaction(); // Start a transaction

    try {
        // Fetch the user with associated cart items and quantities
        const user = await User.findByPk(userId, {
            include: {
                model: Item,
                as: 'Items',
                through: { attributes: ['quantity'] } // Include quantity from the Cart model
            }
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItems = user.Items.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.Cart.quantity
        }));

        if (cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total price
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        // Create a new order including the pickUpDate
        const order = await Order.create({
            userId,
            shippingOption,
            shippingDetails: JSON.stringify(shippingDetails),
            pickUpDate, // Include pick-up date in the order creation
            status: 'Pending',
            totalPrice
        }, { transaction });

        // Save the items in the order
        for (const cartItem of cartItems) {
            await OrderItem.create({
                orderId: order.id,
                itemId: cartItem.id,
                quantity: cartItem.quantity,
                price: cartItem.price
            }, { transaction });
        }

        // Clear the user's cart after the order is placed
        await user.setItems([], { transaction });

        // Commit transaction
        await transaction.commit();

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error occurred while placing the order' });
    }
};


// New function to fetch all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullname', 'email'] // Keep fullname consistent
                },
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Item,
                            attributes: ['id', 'name', 'price'] // Assuming 'name' exists in Item model
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};


exports.getLastOrder = async (req, res) => {
    const userId = req.session.user.id; // Assuming user is logged in

    try {
        const lastOrder = await Order.findOne({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Item,
                            attributes: ['name', 'price'] // Assuming these fields exist in the Item model
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']] // Fetch the most recent order
        });

        if (!lastOrder) {
            return res.status(404).json({ message: 'No recent order found' });
        }

        res.status(200).json(lastOrder);
    } catch (error) {
        console.error('Error fetching last order:', error);
        res.status(500).json({ message: 'Error occurred while fetching the last order' });
    }
};

// Fetch all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
    try {
        // Check if the user is logged in by verifying if user ID exists in the session
        const userId = req.session?.user?.id;

        if (!userId) {
            console.error('User not logged in or no session found');
            return res.status(401).json({ message: 'Please sign in to view your orders.' });
        }

        // Fetch orders for the logged-in user using the orderService
        const orders = await orderService.getOrdersByUserId(userId);

        if (!orders || orders.length === 0) {
            console.log(`No orders found for user with ID: ${userId}`);
            return res.status(200).json([]); // Send an empty array instead of 404
        }
        

        res.status(200).json(orders);
    } catch (error) {
        console.error(`Error fetching orders for user with ID ${userId}:`, error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
//working
// Confirm an order
exports.confirmOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'Confirmed';
        await order.save();

        res.status(200).json({ success: true, message: 'Order confirmed successfully' });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm the order' });
    }
};
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullname', 'email']
                },
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Item,
                            attributes: ['name', 'price']
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure shippingDetails is parsed correctly from the database
        const shippingDetails = JSON.parse(order.shippingDetails || '{}');

        res.status(200).json({
            orderId: order.id,
            user: order.User,
            totalPrice: order.totalPrice,
            status: order.status,
            shippingOption: order.shippingOption,
            shippingDetails,  // Include all shipping details
            pickUpDate: order.pickUpDate,  // Add pick-up date to the response
            items: order.OrderItems.map(item => ({
                name: item.Item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel the order' });
    }
};
