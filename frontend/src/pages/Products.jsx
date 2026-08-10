import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const token = localStorage.getItem('token');

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error('Unable to load products');
        }

        const data = await response.json();

        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Load error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ADD TO CART
  const addToCart = async (productId) => {
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Cart error');
      }

      alert('Added to cart');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className='min-h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-950 dark:text-white py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-10'>

        {/* HEADER */}
        <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-4xl font-bold text-slate-900 dark:text-white'>
              Shop Products
            </h1>

            <p className='mt-2 max-w-2xl text-slate-600 dark:text-slate-300'>
              Browse the latest collection
            </p>
          </div>

          <Link
            to='/cart'
            className='inline-flex items-center rounded-full bg-primary px-6 py-3 text-white shadow-lg transition hover:bg-secondary'
          >
            View Cart
          </Link>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className='rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'>
            Loading products...
          </div>
        ) : error ? (
          /* ERROR */
          <div className='rounded-3xl border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-xl dark:border-red-800 dark:bg-red-900/20 dark:text-red-200'>
            {error}
          </div>
        ) : products.length === 0 ? (
          /* EMPTY */
          <div className='rounded-3xl border border-slate-300 bg-white/80 p-10 text-center text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'>
            No products available yet.
          </div>
        ) : (
          /* PRODUCTS */
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {products.map((product) => {
              
              return (
                <article
                  key={product._id}
                  className='overflow-hidden rounded-4xl bg-white shadow-xl transition hover:-translate-y-1 dark:bg-slate-900'
                >
                  {/* IMAGE */}
                  <div className='aspect-4/3 bg-slate-100'>
                    <img
                      src={`${import.meta.env.VITE_API_URL}${product.image}`}
                      
                      alt={product.title}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://placehold.co/600x450?text=No+Image';
                      }}
                      
                    />
                    
                  </div>

                  {/* CONTENT */}
                  <div className='p-6'>
                    <h2 className='text-2xl font-semibold text-slate-900 dark:text-white'>
                      {product.title}
                    </h2>

                    <p className='mt-3 text-slate-600 dark:text-slate-300'>
                      {product.description}
                    </p>

                    <div className='mt-5 flex items-center justify-between gap-4'>
                      <span className='text-xl font-bold text-slate-900 dark:text-white'>
                        ${product.price.toFixed(2)}
                      </span>

                      <span className='text-xl font-bold text-slate-900 dark:text-white'>
                        Stock: {product.stock}
                      </span>

                      <span className='text-xl font-bold text-slate-900 dark:text-white'>
                        {product.category}
                      </span>
                    </div>

                    {/* ADD TO CART BUTTON */}
                    <button
                      onClick={() => addToCart(product._id)}
                      className='mt-5 w-full rounded-full bg-green-500 py-3 text-white transition hover:bg-green-600'
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      {orderPlaced && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
    
    <div className="scale-95 animate-popIn rounded-2xl bg-white p-8 text-center shadow-2xl transition-all duration-300 dark:bg-slate-900">
      
      <h1 className="text-2xl font-bold text-green-600 animate-bounce">
        🎉 Added to Cart!
      </h1>

      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Item has been successfully added.
      </p>

      <button
        onClick={() => setOrderPlaced(false)}
        className="mt-5 rounded-full bg-primary px-6 py-2 text-white transition hover:bg-secondary"
      >
        Continue Shopping
      </button>

    </div>
  </div>
)}
    </section>
  );
};

export default Products;