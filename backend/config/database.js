const { Sequelize } = require('sequelize');

// Database connection configuration
const sequelize = new Sequelize('defaultdb', 'avnadmin', 'AVNS_uhww5P6_B4mcYSTAeeg', {
    host: 'pg-osas-osas-global.b.aivencloud.com',
    port: 14200,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Allow self-signed certificates
        }
    },
    logging: false // Disable logging
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
