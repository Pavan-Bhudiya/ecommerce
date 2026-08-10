import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const categoryLabels = {
  'kids-wear': 'kids-wear',
  'mens-wear': 'mens-wear',
  'women-wear': 'women-wear',
  'electronics': 'electronics',
  'books': 'books',
  'trending-products': 'trending-products',
};



const Category = () => {
  const { slug } = useParams();
  const token = localStorage.getItem('token');
  const categoryName = categoryLabels[slug] || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?category=${encodeURIComponent(categoryName)}`);
        if (!response.ok) {
          throw new Error('Unable to load category products');
        }
        if(!categoryName){
          throw new Error('Select Category');
        }
        const data = await response.json();
        setProducts(data);
      } catch {
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

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
      throw new Error(data.message || 'Failed to add to cart');
    }

    alert('Added to cart');
  } catch (err) {
    alert(err.message);
  }
};



  return (
    <section className='min-h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-950 dark:text-white py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-10'>
        <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-4xl font-bold text-slate-900 dark:text-white'>{categoryName}</h1>
            <p className='mt-2 max-w-2xl text-slate-600 dark:text-slate-300'>Browse the {categoryName} collection.</p>
          </div>
          <Link
            to='/cart'
            className='inline-flex items-center rounded-full bg-primary px-6 py-3 text-white shadow-lg transition hover:bg-secondary'
          >
            View Cart
          </Link>
        </div>

        {loading ? (
          <div className='rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'>
            Loading category products...
          </div>
        ) : error ? (
          <div className='rounded-3xl border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-xl dark:border-red-800 dark:bg-red-900/20 dark:text-red-200'>
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className='rounded-3xl border border-slate-300 bg-white/80 p-10 text-center text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'>
            No products found for this category.
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {products.map((product) => {
              return (
                <article key={product._id} className='overflow-hidden rounded-4xl bg-white shadow-xl transition hover:-translate-y-1 dark:bg-slate-900'>
                  <div className='aspect-4/3 bg-slate-100'>
                    <img
                        src={`${import.meta.env.VITE_API_URL}${product.image}`}
                        alt={product.title}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src ='https://placehold.co/600x450?text=No+Image';
                      }}
                    />
                  </div>
                  <div className='p-6'>
                    <h2 className='text-2xl font-semibold text-slate-900 dark:text-white'>{product.title}</h2>
                    <p className='mt-3 text-slate-600 dark:text-slate-300'>{product.description}</p>
                    <div className='mt-5 flex items-center justify-between gap-4'>
                      <span className='text-xl font-bold text-slate-900 dark:text-white'>${product.price.toFixed(2)}</span>
                      <span className='text-xl font-bold text-slate-900 dark:text-white'>Stock: {product.stock}</span>
                      <span className='text-xl font-bold text-slate-900 dark:text-white'>{product.category}</span>
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
    </section>
  );
};

export default Category;
