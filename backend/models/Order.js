const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Assuming User model is already created

const Order = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    shippingOption: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingDetails: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pickUpDate: { // Change this to pickUpDate
        type: DataTypes.DATE,
        allowNull: false // Keep it required if necessary
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending' // Pending, Shipped, Completed, or Cancelled
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});


module.exports = Order;
