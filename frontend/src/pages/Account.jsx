import { Link } from 'react-router-dom';

const Account = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = stored ? JSON.parse(stored) : null;

  return (
    <div className='min-h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-950 dark:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-2xl rounded-3xl bg-white/90 dark:bg-slate-900/90 p-10 shadow-2xl backdrop-blur-sm'>
        {user ? (
          <>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>My Account</h2>
            <p className='mt-4 text-slate-700 dark:text-slate-300'>Welcome back, {user.name}.</p>
            <div className='mt-8 space-y-4 text-slate-700 dark:text-slate-300'>
              <div>
                <h3 className='font-semibold'>Name</h3>
                <p>{user.name}</p>
              </div>
              <div>
                <h3 className='font-semibold'>Email</h3>
                <p>{user.email}</p>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>Not signed in</h2>
            <p className='mt-4 text-slate-700 dark:text-slate-300'>Please login or register to view your account.</p>
            <Link to='/login' className='mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-white hover:bg-secondary'>
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
