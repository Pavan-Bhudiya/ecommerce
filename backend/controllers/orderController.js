const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product', 'title image price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOrder = async (req, res) => {
  const { items, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include at least one item' });
  }

  try {
    const validItems = [];

    for (const item of items) {
      const productId = item.product._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ message: `Product not found: ${productId}` });
      }

      // ONLY CHECK STOCK 
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.title}". Only ${product.stock} available.`,
        });
      }

      validItems.push({
        product: product._id,
        quantity: item.quantity || 1,
        price: product.price,
      });
    }

    // ✅ CREATE ORDER 
    const order = await Order.create({
      user: req.user.id,
      items: validItems,
      total: total || validItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Pending', 
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: 'Server error during checkout process' });
  }
};
