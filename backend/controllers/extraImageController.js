const extraImageService = require('../services/extraImageService');

// Add a new extra image
exports.addExtraImage = async (req, res) => {
    try {
        const extraImageData = req.body;
        const extraImage = await extraImageService.addExtraImage(extraImageData);
        res.status(201).json(extraImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all extra images for a specific item
exports.getExtraImagesByItemId = async (req, res) => {
    try {
        const { itemId } = req.params;
        const extraImages = await extraImageService.getExtraImagesByItemId(itemId);
        res.status(200).json(extraImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an extra image
exports.deleteExtraImage = async (req, res) => {
    try {
        const { id } = req.params;
        await extraImageService.deleteExtraImage(id);
        res.status(200).json({ message: 'Extra image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

