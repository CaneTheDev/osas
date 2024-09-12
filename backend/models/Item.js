const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Other'
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true
    },
    productDetails: {
        type: DataTypes.TEXT,
        allowNull: true
    },
 // New field for product model (e.g., Nokia 3310, iPhone 13 Pro Max)
 productModel: {
    type: DataTypes.STRING,
    allowNull: true
},
// New field for product availability
productAvailability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true // true means in stock, false means out of stock
},
// New field for product specification
productSpecification: {
    type: DataTypes.TEXT,
    allowNull: true
}

});

module.exports = Item;
