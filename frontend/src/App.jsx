import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Products from './pages/Products';
import Category from './pages/Category';
import Cart from './pages/addCart';
import Payment from './pages/Payment';
import AIWidget from './components/AIWidget/AIWidget';

const App = () => {
  return (
    
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/products' element={<Products />} />
        <Route path='/category/:slug' element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/account' element={<Account />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/payment' element={<Payment/>}/>
        <Route path='*' element={<Hero />} />
      </Routes>
      <AIWidget />
    </BrowserRouter>
  );
};

export default App;