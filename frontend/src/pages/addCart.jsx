import  { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return !storedToken;
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token')

  // FETCH CART
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to load cart');

        if (!cancelled) setCart(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // REMOVE ITEM
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

  // CLEAR CART
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

  // TOTAL PRICE
  const total =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  // NOT LOGGED IN
  if (!token) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Cart</h2>
          <p className="mt-4">Please login to view your cart</p>
          <Link
            to="/login"
            className="mt-6 inline-block bg-primary px-6 py-3 rounded-full text-white"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center text-white">
        Loading cart...
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-950 dark:text-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold">Your Cart</h1>

        {/* EMPTY CART */}
        {cart?.items?.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-lg">Your cart is empty</p>
            <Link
              to="/products"
              className="mt-4 inline-block bg-primary px-6 py-3 rounded-full text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* ITEMS */}
            <div className="mt-8 space-y-6">
              {cart?.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${item.product.image}`}
                      className="w-20 h-20 object-cover rounded-xl"
                      alt={item.product.title}
                    />

                    <div>
                      <h2 className="font-semibold">
                        {item.product.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        ${item.product.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500 hover:text-red-700 bg-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-8 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Total: ${total.toFixed(2)}
              </h2>

              <div className="flex gap-4">
                 <button onClick={clearCart} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition" >
                  Clear Cart
                </button>

                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-3 bg-green-500 text-white rounded-full"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;