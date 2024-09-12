const sequelize = require('./config/database'); // Import the sequelize instance
const User = require('./models/User'); // Import the User model
const Item = require('./models/Item'); // Import the Item model
const ExtraImage = require('./models/ExtraImage'); // Import the ExtraImage model
const Cart = require('./models/Cart'); // Import the Cart model
const Order = require('./models/Order'); // Import the Order model
const OrderItem = require('./models/OrderItem'); // Import the OrderItem model
const Admin = require('./models/Admin'); // Import the Admin model

// Define associations between models
Item.hasMany(ExtraImage, { as: 'extraImages', foreignKey: 'itemId' });
ExtraImage.belongsTo(Item, { foreignKey: 'itemId' });

// Define associations for Order and OrderItem models
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Item.hasMany(OrderItem, { foreignKey: 'itemId' });
OrderItem.belongsTo(Item, { foreignKey: 'itemId' });

// Sync all models with the database
sequelize.sync({ alter: true }) // This will update the existing tables without losing data
    .then(() => console.log('All models are synced with the database.'))
    .catch(err => console.log('Error syncing the models: ' + err));
