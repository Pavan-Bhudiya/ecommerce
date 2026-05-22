const express = require('express');
const { getOrders, createOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getOrders);
router.post('/', auth, createOrder);

module.exports = router;
