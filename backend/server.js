const express = require('express');
const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const checkoutRoutes = require('./routes/checkout');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

app.get('/', (req, res) => {
  res.send('Urban Basket backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/checkout', checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
