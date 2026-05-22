const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category.trim();
  }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  const { title, description, image, price, category, stock } = req.body;

  try {
    const product = await Product.create({
      title,
      description,
      image,
      price,
      stock,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
