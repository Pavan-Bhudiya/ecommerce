const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
  createOrder,
  getOrders,
} = require('../controllers/checkoutController');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);

module.exports = router;