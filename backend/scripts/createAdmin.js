const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const sequelize = require('../config/database'); // Ensure you're connecting to your database

// Function to create an initial admin account
const createAdmin = async () => {
    const email = 'admin@example.com'; // Change this to the desired initial email
    const password = 'adminpassword'; // Change this to the desired initial password

    try {
        // Check if an admin with this email already exists
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin account already exists. No new admin was created.');
            return;
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create the admin account
        const newAdmin = await Admin.create({
            email,
            password: hashedPassword
        });

        console.log('Admin account created successfully:', newAdmin.email);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        // Close the database connection
        sequelize.close();
    }
};

createAdmin();
