const Order = require('../models/Order');
const Product = require('../models/Product');

// CREATE ORDER (NO STOCK DEDUCTION)
exports.createOrder = async (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  try {
    const validItems = [];

    for (const item of items) {
      const productId = item.product._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.title}`,
        });
      }

      validItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: validItems,
      total,
      status: 'Pending',
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Checkout failed' });
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'title image price');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};