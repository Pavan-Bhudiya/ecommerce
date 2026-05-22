const Order = require('../models/Order');
const Product = require('../models/Product');
const axios = require('axios');
const { getAccessToken, generatePassword } = require('../utilis/daraja');

exports.stkPush = async (req, res) => {
  const { phone, orderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order already paid or processed' });
    }

    const token = await getAccessToken();
    const { password, timestamp } = generatePassword();

    const formattedPhone = phone.startsWith('0')
      ? '254' + phone.slice(1)
      : phone;
    
    if (!order.total || isNaN(order.total) || order.total <= 0) {
      return res.status(400).json({
      message: "Invalid order total for payment",
    });
}
    const total = order.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
}, 0);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(total),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `ORDER-${order._id}`,
      TransactionDesc: 'Order Payment',
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({
      message: 'STK push sent',
      data: response.data,
    });

  } catch (error) {
    console.error("STK PUSH ERROR:", {
    message: error.message,
    response: error.response?.data,
});
    res.status(500).json({ message: 'STK push failed' });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const body = req.body;

    const stkCallback = body.Body.stkCallback;
    const resultCode = stkCallback.ResultCode;

    const accountRef = stkCallback.AccountReference;
    const orderId = accountRef.replace('ORDER-', '');

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ❌ PAYMENT FAILED
    if (resultCode !== 0) {
      order.status = 'Failed';
      await order.save();
      return res.json({ message: 'Payment failed' });
    }

    // 🧠 IMPORTANT: prevent double callback processing
    if (order.status === 'Paid') {
      return res.json({ message: 'Already processed' });
    }

    // ✅ PAYMENT SUCCESS → REDUCE STOCK HERE ONLY
    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }

    order.status = 'Paid';
    await order.save();

    res.json({ message: 'Payment confirmed & stock updated' });

  } catch (error) {
    console.error('Callback Error:', error);
    res.status(500).json({ message: 'Callback error' });
  }
};
