const express = require('express');
const { getProducts, createProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.post('/', auth, createProduct);

module.exports = router;
