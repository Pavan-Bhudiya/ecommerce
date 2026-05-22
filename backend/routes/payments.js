const express = require('express');
const router = express.Router();

const {
  stkPush,
  mpesaCallback,
} = require('../controllers/paymentController');

router.post('/stkpush', stkPush);
router.post('/callback', mpesaCallback);

module.exports = router;