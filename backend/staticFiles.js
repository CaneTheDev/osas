const express = require('express');
const path = require('path');

module.exports = function(app) {
    // Serve static files
    app.use(express.static('frontend'));
    app.use('/image', express.static(path.join(__dirname, '../frontend/image')));
    app.use(express.static(path.join(__dirname, '../frontend/views')));
    app.use(express.static(path.join(__dirname, '../frontend/public')));
};
