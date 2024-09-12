// Path: backend/app.js
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const extraImageRoutes = require('./routes/extraImageRoutes');
const cartRoutes = require('./routes/cart');
const generalRoutes = require('./routes/generalRoutes');

const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/adminRoutes');


// Import Middleware
require('./middleware')(app);

// Import Static File Handling
require('./staticFiles')(app);




// Route to list all images
app.get('/images/list', (req, res) => {
    const imageDir = path.join(__dirname, '../frontend/image');
    fs.readdir(imageDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        const images = files;
        res.json(images);
    });
});

// API routes
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/api', require('./routes/item'));
app.use('/api', extraImageRoutes);
app.use('/cart', cartRoutes); // Add cart routes here
app.use('/order', orderRoutes); // Order routes
app.use('/admin', adminRoutes);

// General routes for pages
app.use('/', generalRoutes);

// Import the syncModels.js to ensure models are synced at startup
require('./syncModels');

module.exports = app;
