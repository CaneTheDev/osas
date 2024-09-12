// backend/models/Cart.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Item = require('./Item');

const Cart = sequelize.define('Cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default to 1 item in the cart
    }
});

// Define associations
User.belongsToMany(Item, { through: Cart, as: 'Items' });
Item.belongsToMany(User, { through: Cart, as: 'Users' });

module.exports = Cart;
