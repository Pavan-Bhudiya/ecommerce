import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.jpg';
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown, FaCartShopping } from "react-icons/fa6";



const Menu=[
    {
        id:1,
        name:"Home",
        link:"/",
    },
    {
        id:2,
        name:"Products",
        link:"/products",
    },
    {
        id:3,
        name:"Kids Wear",
        link:"/category/kids-wear",
    },
    {
        id:4,
        name:"Mens Wear",
        link:"/category/mens-wear",
    },
    {
        id:5,
        name:"Female Wear",
        link:"/category/women-wear",
    },
    {
        id:6,
        name:"Electronics",
        link:"/category/electronics",
    },
]
const DropdownLinks=[
    {
        id:1,
        name:"Trending Products",
        link:"/category/trending-products",

    },
    {
        id:2,
        name:"Books",
        link:"/category/books",

    },

]

const Navbar = () => {
    //use State hook to manage the state of the menu (open/close)
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <div className='shadow-md dark:text-white duration-200 relative z-40'>
            {/*Upper Navbar*/}
            <div className=' bg-white dark:bg-gray-900 py-3 py-2'>
                <div className='container flex justify-between items-center'>
                    <div>
                        <Link to='/'
                        className='font-bold text-2xl 
                        sm:text-3xl flex gap-2'
                        >
                            <img src={Logo} alt="Logo"
                            className='w-10 ' />
                            UrbanBasket
                        </Link>
                    </div>
                    {/*Search Bar*/}  
                    <div className='flex justify-between items-center gap-4'>
                        <div className="relative group hidden sm:block">
                            <input type="text" 
                            placeholder="Search for products, brands and more"
                            className="w-[200px] sm:w-[200px] group-hover:w-[300px] 
                            transition-all duration-300 rounded-full border border-gray-300 px-2 py-1
                            focus:outline-none 
                            focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                             />
                             <IoMdSearch
                             className='text-gray-500 
                             group-hover:text-primary 
                             absolute top-1/2 
                             -translate-y-1/2 left-3'/>
                        </div>
                    </div>
                    {/*Hamburger Menu*/}
                    <button
                        onClick={()=>setIsMenuOpen(!isMenuOpen)}
                        
                        className='sm:hidden block text-2xl'>
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16'/>
                            </svg>
                    </button>   
                    {/*Order button*/}
                    <button 
                        onClick={()=>navigate('/products')}
                        className='bg-gradient-to-r 
                        from-primary to-secondary 
                        transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center 
                        gap-3 group'>
                        <span
                        className='group-hover:block hidden transition-all duration-200'>Order Now
                        </span>
                        <FaCartShopping
                        className='text-xl text-white drop-shadow-sm cursor-pointer' link='/products' />
                    </button>
                    {/*Darkmode Switch*/}
                    <div className='hidden md:flex items-center gap-4'>
                        {user ? (
                            <>
                                <Link to='/account' className='text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-200'>
                                    My Account
                                </Link>
                                <Link to='/orders' className='text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-200'>
                                    Orders
                                </Link>
                                <Link to='/checkout' className='text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-200'>
                                    Checkout
                                </Link>
                                <button onClick={handleLogout} className='rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-primary dark:border-slate-600 dark:text-slate-200'>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to='/login' className='text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-200'>
                                    Login
                                </Link>
                                <Link to='/register' className='rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-primary dark:border-slate-600 dark:text-slate-200'>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
                    {/* Lower Navbar / Mobile Menu */}
                    <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:block w-full bg-gray-50 dark:bg-gray-800`}>
                        <ul className='w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 p-4 sm:p-0'>
                            {Menu.map((data) => (
                                <li key={data.id}>
                                    <Link to={data.link}
                                       className='inline-block px-4 hover:text-primary duration-200 block sm:inline-block'
                                        >
                                        {data.name}
                                    </Link>
                                </li>
                    ))}
        
                    {/* Dropdown  */}
                    <li className='group relative cursor-pointer w-full sm:w-auto'>
                        <a href="#"
                        className='flex items-center gap-[2px] py-2 px-4'
                        >
                        Trending Products
                        <span>
                          <FaCaretDown className='transition-all duration-200 group-hover:rotate-180' />
                        </span>
                        </a>
                    <div className='absolute z-[9999] hidden group-hover:block w-[150px] rounded-md bg-white p-2 text-black shadow-md sm:absolute sm:top-full'>
                        <ul>
                             {DropdownLinks.map((data) => (
                            <li key={data.id}>
                                <a href={data.link}
                                className='inline-block w-full rounded-md p-2 hover:bg-primary/20'
                                >
                                {data.name}
                                </a>
                            </li>
                            ))}
                        </ul>
                    </div>
                            </li>
                        </ul>
    </div>
</div>
    );
}

export default Navbar;