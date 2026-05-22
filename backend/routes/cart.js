const express=require('express');
const router=express.Router();

const authMiddleware=require('../middleware/auth');
const {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
}=require('../controllers/CartController');

//api routes
router.get('/',authMiddleware,getCart);
router.post('/add',authMiddleware,addToCart);
router.delete('/remove/:productId',authMiddleware,removeFromCart);
router.delete('/clear',authMiddleware,clearCart);
router.put('/update', authMiddleware, updateCartItem);

module.exports=router;