const https = require('https');  // Use 'https' module for https URLs

// Function to ping the servers every 1 minute
function keepAlive() {
    setInterval(() => {
        // Ping the first server
        https.get('https://osas-avw7.onrender.com/');
        console.log('Pinged osas-avw7 server to keep it awake');

        // Ping the second server
        https.get('https://oyaa.onrender.com/');
        console.log('Pinged oyaa server to keep it awake');
    }, 60000); // 60000ms = 1 minute
}

module.exports = keepAlive;
