const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExtraImage = sequelize.define('ExtraImage', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = ExtraImage;
