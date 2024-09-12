const ExtraImage = require('../models/ExtraImage');

// Add a new extra image
async function addExtraImage(data) {
    try {
        return await ExtraImage.create(data);
    } catch (error) {
        console.error('Error in addExtraImage:', error);
        throw error;
    }
}

// Get all extra images for a specific item
async function getExtraImagesByItemId(itemId) {
    try {
        return await ExtraImage.findAll({ where: { itemId } });
    } catch (error) {
        console.error('Error in getExtraImagesByItemId:', error);
        throw error;
    }
}

// Delete an extra image
async function deleteExtraImage(id) {
    try {
        return await ExtraImage.destroy({ where: { id } });
    } catch (error) {
        console.error('Error in deleteExtraImage:', error);
        throw error;
    }
}

module.exports = {
    addExtraImage,
    getExtraImagesByItemId,
    deleteExtraImage
};
