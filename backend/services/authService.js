const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
async function registerUser(fullname, email, password) {
    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        fullname,
        email,
        password: hashedPassword
    });

    return user;
}

// Authenticate a user
async function loginUser(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return null;
    }

    return user;
}

module.exports = {
    registerUser,
    loginUser
};
