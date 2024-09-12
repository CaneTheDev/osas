const https = require('https');  // Use 'https' module for https URLs

// Function to ping the server every 1 minute
function keepAlive() {
    setInterval(() => {
        https.get('https://osas-avw7.onrender.com/'); // Render URL with https
        console.log('Pinged the server to keep it awake');
    }, 60000); // 60000ms = 1 minute
}

module.exports = keepAlive;
