const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    let imagePath = '';
    
    if (req.file) {
      imagePath = `/uploads/categories/${req.file.filename}`;
    }

    const category = new Category({
      name,
      description,
      image: imagePath,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getCategories, createCategory };
