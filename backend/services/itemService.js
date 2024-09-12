const { Op } = require('sequelize');

const Item = require('../models/Item');

// Add a new item
async function addItem(data) {
    try {
        // Directly save the data, which includes the tags field
        return await Item.create(data);
    } catch (error) {
        console.error('Error in addItem:', error);
        throw error;
    }
}

// Get all items
async function getAllItems() {
    return await Item.findAll();
}

// Get items by category
async function getItemsByCategory(category) {
    return await Item.findAll({ where: { category } });
}

// Update an item
async function updateItem(id, data) {
    try {
        return await Item.update(data, { where: { id } });
    } catch (error) {
        console.error('Error in updateItem:', error);
        throw error;
    }
}
// Delete an item
async function deleteItem(id) {
    return await Item.destroy({ where: { id } });
}

// Get an item by ID
async function getItemById(id) {
    return await Item.findByPk(id); // Correct method for finding an item by primary key
}

// Get items by tag
// Update this function in itemService.js
async function getItemsByTag(tag) {
    return await Item.findAll({ where: { tags: { [Op.like]: `%${tag}%` } } });
}

// Search items by name or tags
async function searchItems(query) {
    return await Item.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } }, // Case-insensitive search for name
                { tags: { [Op.iLike]: `%${query}%` } }  // Case-insensitive search for tags
            ]
        }
    });
}


module.exports = {
    addItem,
    getAllItems,
    getItemsByCategory,
    updateItem,
    deleteItem,
    getItemById,
    getItemsByTag,
    searchItems
};