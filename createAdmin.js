const bcrypt = require('bcrypt');
const Admin = require('./backend/models/Admin');
const sequelize = require('./backend/config/database');

async function createAdmin() {
    try {
        // Define your initial admin credentials
        const username = 'admin';
        const password = 'admin123';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the admin user in the database
        await Admin.create({
            username: username,
            password: hashedPassword,
        });

        console.log('Admin user created successfully!');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await sequelize.close(); // Close the database connection
    }
}

createAdmin();
