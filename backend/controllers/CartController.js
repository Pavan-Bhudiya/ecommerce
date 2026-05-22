const Cart = require('../models/Cart');


// GET USER CART
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.id,
    }).populate('items.product');

    // CREATE EMPTY CART
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    res.json(cart);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
};


// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // CREATE CART IF NONE
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    // CHECK IF ITEM EXISTS
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    await cart.populate('items.product');

    res.json(cart);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
};


// REMOVE FROM CART
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId
    );

    await cart.save();

    await cart.populate('items.product');

    res.json(cart);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
};


// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (cart) {
      cart.items = [];

      await cart.save();
    }

    res.json({
      message: 'Cart cleared',
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
};



// UPDATE CART ITEM QUANTITY
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    await cart.save();

    await cart.populate('items.product');

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};