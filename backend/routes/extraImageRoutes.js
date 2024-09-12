// backend/routes/extraImage.js
const express = require('express');
const extraImageController = require('../controllers/extraImageController');

const router = express.Router();

router.post('/extra-images', extraImageController.addExtraImage);
router.get('/extra-images/:itemId', extraImageController.getExtraImagesByItemId);
router.delete('/extra-images/:id', extraImageController.deleteExtraImage);

module.exports = router;
