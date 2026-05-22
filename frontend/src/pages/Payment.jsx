import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePay = async () => {
    if (!phone) return setMessage('Enter phone number');

    setLoading(true);
    setMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      // 1. Get latest order (you can improve later)
      const orderRes = await fetch(`${apiUrl}/api/checkout/latest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const order = await orderRes.json();

      // 2. Trigger STK push
      const payRes = await fetch(`${apiUrl}/api/payments/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          orderId: order._id,
        }),
      });

      const data = await payRes.json();

      if (!payRes.ok) throw new Error(data.message);

      setMessage('STK Push sent! Check your phone.');

      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-white mb-6">
          Complete Payment
        </h1>

        <input
          type="text"
          placeholder="Enter M-Pesa number (07...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 mb-4"
        />

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded-full"
        >
          {loading ? 'Processing...' : 'Pay with M-Pesa'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default Payment;