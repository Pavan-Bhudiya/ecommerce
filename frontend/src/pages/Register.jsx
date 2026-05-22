import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError('Unable to register. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-950 dark:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md rounded-3xl bg-white/90 dark:bg-slate-900/90 p-8 shadow-2xl backdrop-blur-sm'>
        <button type='button' onClick={() => navigate(-1)} className='mb-4 text-sm font-semibold text-primary hover:underline'>
          ← Back
        </button>
        <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>Create account</h2>
        <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>Register now to start shopping with your account.</p>

        {error && <div className='mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-300'>{error}</div>}

        <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Name</span>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white'
            />
          </label>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Email</span>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white'
            />
          </label>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Password</span>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white'
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-full bg-primary px-6 py-3 text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70'
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
          Already have an account?{' '}
          <Link to='/login' className='font-semibold text-primary hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
