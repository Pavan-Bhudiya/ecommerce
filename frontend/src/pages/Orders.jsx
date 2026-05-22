import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Unable to load orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return (
    <div className='min-h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-950 dark:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-4xl rounded-3xl bg-white/90 dark:bg-slate-900/90 p-10 shadow-2xl backdrop-blur-sm'>
        {!token ? (
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>Not signed in</h2>
            <p className='mt-4 text-slate-700 dark:text-slate-300'>Please login or register to view orders.</p>
            <Link to='/login' className='mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-white hover:bg-secondary'>
              Login
            </Link>
          </div>
        ) : loading ? (
          <div className='rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'>
            Loading orders...
          </div>
        ) : error ? (
          <div className='rounded-3xl border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-xl dark:border-red-800 dark:bg-red-900/20 dark:text-red-200'>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'>
            <h2 className='text-2xl font-semibold text-slate-900 dark:text-white'>No orders yet</h2>
            <p className='mt-3'>Browse products and place an order to see your history.</p>
            <Link to='/checkout' className='mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-white hover:bg-secondary'>
              Go to Checkout
            </Link>
          </div>
        ) : (
          <>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>Your Orders</h2>
            <div className='mt-6 space-y-6'>
              {orders.map((order) => (
                <div key={order._id} className='rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center'>
                    <div>
                      <p className='text-sm text-slate-500 dark:text-slate-400'>Order ID: {order._id}</p>
                      <p className='text-lg font-semibold text-slate-900 dark:text-white'>Status: {order.status}</p>
                    </div>
                    <p className='text-xl font-bold text-slate-900 dark:text-white'>${order.total.toFixed(2)}</p>
                  </div>
                  <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                    {order.items.map((item, index) => (
                      <div key={index} className='rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950'>
                        <p className='font-semibold text-slate-900 dark:text-white'>{item.product.title}</p>
                        <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>Qty: {item.quantity}</p>
                        <p className='text-sm text-slate-600 dark:text-slate-300'>Price: ${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
