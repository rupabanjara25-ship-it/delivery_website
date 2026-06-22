const Product = require('../models/Product');

// @desc    Get all products (optionally filtered by category)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    let query = {};
    if (category) {
      query.category = category;
    }
    const products = await Product.find(query).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      images: imagePaths,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };
