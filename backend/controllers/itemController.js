const itemService = require('../services/itemService');
// Predefined tags
const ALLOWED_TAGS = ['No tag','latest-deals', 'top-deals', 'limited-offers','ios','Samsung','Jbl'];

// Add a new item
exports.addItem = async (req, res) => {
    try {
        const itemData = req.body;

        // Ensure tags are valid and are a string
        if (itemData.tags) {
            if (typeof itemData.tags === 'string') {
                // Check if tags exist in ALLOWED_TAGS
                const tagsArray = itemData.tags.split(',').map(tag => tag.trim());
                if (tagsArray.every(tag => ALLOWED_TAGS.includes(tag))) {
                    itemData.tags = tagsArray.join(',');
                } else {
                    return res.status(400).json({ message: 'Invalid tag(s) provided' });
                }
            } else {
                return res.status(400).json({ message: 'Tags should be a string' });
            }
        }

        const item = await itemService.addItem(itemData);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const itemData = req.body;

        // Ensure tags are valid and are a string
        if (itemData.tags) {
            if (typeof itemData.tags === 'string') {
                // Check if tags exist in ALLOWED_TAGS
                const tagsArray = itemData.tags.split(',').map(tag => tag.trim());
                if (tagsArray.every(tag => ALLOWED_TAGS.includes(tag))) {
                    itemData.tags = tagsArray.join(',');
                } else {
                    return res.status(400).json({ message: 'Invalid tag(s) provided' });
                }
            } else {
                return res.status(400).json({ message: 'Tags should be a string' });
            }
        }

        await itemService.updateItem(id, itemData);
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all items with their extra images
exports.getAllItems = async (req, res) => {
    try {
        const items = await itemService.getAllItems();

        const formattedItems = items.map(item => ({
            ...item.toJSON(),
            tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : []
        }));

        res.status(200).json(formattedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single item by ID with tags as an array and extra images
exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await itemService.getItemById(id);

        if (item) {
            const formattedItem = {
                ...item.toJSON(),
                tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : []
            };
            res.status(200).json(formattedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await itemService.deleteItem(id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch items by category with extra images
exports.getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const items = await itemService.getItemsByCategory(category);

        const formattedItems = items.map(item => ({
            ...item.toJSON(),
            tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : []
        }));

        res.status(200).json(formattedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch items by tag with extra images
exports.getItemsByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const items = await itemService.getItemsByTag(tag);

        const formattedItems = items.map(item => ({
            ...item.toJSON(),
            tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : []
        }));

        res.status(200).json(formattedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search items by name or tags with extra images
exports.searchItems = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        const items = await itemService.searchItems(query);

        const formattedItems = items.map(item => ({
            ...item.toJSON(),
            tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : []
        }));

        res.status(200).json(formattedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all tags
exports.getTags = async (req, res) => {
    try {
        res.status(200).json(ALLOWED_TAGS);  // Return the ALLOWED_TAGS array
    } catch (error) {
        console.error('Error fetching tags:', error);  // Log error details
        res.status(500).json({ message: error.message });
    }
};
