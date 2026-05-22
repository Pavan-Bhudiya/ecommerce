import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [phone ,setPhone]=useState('');

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // -------------------------
  // FETCH CART (FIXED SCOPE)
  // -------------------------
  const fetchCart = async () => {
    if (!token) return;

    try {
      const res = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // -------------------------
  // UPDATE QUANTITY
  // -------------------------
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    try {
      setCart((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: Number(newQty) }
            : item
        );
        return { ...prev, items: updatedItems };
      });

      const apiUrl = import.meta.env.VITE_API_URL;

      const res = await fetch(`${apiUrl}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: Number(newQty),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCart(data);
    } catch (error) {
      alert(error.message);
      fetchCart();
    }
  };

  // -------------------------
  // REMOVE ITEM
  // -------------------------
  const removeItem = async (productId) => {
    try {
      const res = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCart(data);
    } catch (err) {
      alert(err.message);
    }
  };

  // -------------------------
  // CLEAR CART
  // -------------------------
  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCart({ items: [] });
    } catch (err) {
      alert(err.message);
    }
  };

  // -------------------------
  // TOTAL PRICE
  // -------------------------
  const total =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  // -------------------------
  // PLACE ORDER + PAYMENT
  // -------------------------
  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderBody = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        total,
      };

      // 1. CREATE ORDER
      const orderRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderBody),
      });

      const orderData = await orderRes.json();


      if (!orderRes.ok) {
        throw new Error(orderData.message || "Order creation failed");
      }

      // 2. TRIGGER PAYMENT (STK PUSH)
      const paymentRes = await fetch('/api/payments/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          orderId: orderData._id,
        }),
      });

      const paymentData = await paymentRes.json();

      console.log("PAYMENT RESPONSE:", paymentData);

      if (!paymentRes.ok) {
        throw new Error(paymentData.message || "Payment failed");
      }

      alert("Check your phone to complete payment");

      // OPTIONAL: redirect to status page
      navigate('/payment');

    } catch (err) {
      console.error(err);
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (!token) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <Link to="/login">Login required</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-3xl">

        <h1 className="text-3xl font-bold text-white">Checkout</h1>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* CART ITEMS */}
        <div className="mt-6 space-y-6">
          {cart?.items?.map((item) => (
            <div key={item._id} className="text-white border-b pb-4 space-y-3">

              <div className="text-lg font-semibold">
                {item.product.title}
              </div>

              <div className="text-sm text-gray-300">
                Price: ${item.product.price}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Quantity</label>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.product._id, e.target.value)
                  }
                  className="w-24 px-2 py-1 text-white rounded"
                />
              </div>

              <button
                onClick={() => removeItem(item.product._id)}
                className="text-red-500 hover:text-red-700 bg-red-100 px-3 py-1 rounded text-sm"
              >
                Remove
              </button>

              <div className="text-sm font-semibold">
                Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 font-bold text-xl text-white">
          Total: ${total.toFixed(2)}
        </div>

        {/* CLEAR */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-500 text-white rounded-full"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-4">
  <label className="text-white text-sm">Phone Number</label>
  <input
    type="text"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="0712345678"
    className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white"
  />
</div>

        {/* PLACE ORDER */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="mt-6 w-full bg-green-500 text-white py-3 rounded-full disabled:opacity-50"
        >
          {loading ? 'Processing Payment...' : 'Place Order'}
        </button>

      </div>
    </div>
  );
};

export default Checkout;