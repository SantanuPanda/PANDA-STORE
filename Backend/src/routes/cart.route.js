const express=require('express');
const router=express.Router();
const {addToCart,getCart,UpdateCart}=require('../controller/cart.controller');
const authMiddleware=require('../middleware/auth.middleware');


router.post('/addtocart',authMiddleware,addToCart);
router.get('/getcart',authMiddleware,getCart);
router.post('/updatecart',authMiddleware,UpdateCart);


module.exports=router;