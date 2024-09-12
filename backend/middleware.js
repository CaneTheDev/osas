const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

// Initialize multer with a custom storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'frontend/image/');
    },
    filename: function (req, file, cb) {
        const imageName = req.body.imageName ? `${req.body.imageName}${path.extname(file.originalname)}` : file.originalname;
        cb(null, imageName);
    }
});
const upload = multer({ storage: storage });

module.exports = function(app) {
    // Session middleware
    app.use(session({
        secret: 'yourSecretKey',  // Replace this with your own secret key
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set to true if using HTTPS
    }));

    // Body parser middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Multer middleware for image upload
    app.post('/upload-image', upload.single('image'), (req, res) => {
        if (req.file) {
            const imageUrl = `/image/${req.file.filename}`;
            res.json({ url: imageUrl });
        } else {
            res.status(400).json({ error: 'No file uploaded' });
        }
    });
};
