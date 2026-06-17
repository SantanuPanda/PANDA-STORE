const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/auth.middleware');
const AdminAuthMiddleware=require('../middleware/admin.auth');
const {allOrders,userOrder,updateOrderStatus,verifyStripe}=require('../controller/order.controller');
const {placeOrder,placeOrderStripe,placeOrderRazorpay,verifyRazorpay}=require('../controller/order.controller');

/* User features Routes */
router.get('/userorders',authMiddleware,userOrder);

/*payment Routes*/
router.post('/placeorder',authMiddleware,placeOrder);
router.post('/placestripeorder',authMiddleware,placeOrderStripe);
router.post('/placerazorpayorder',authMiddleware,placeOrderRazorpay);


/* Admin features Routes */
router.get('/allorders',AdminAuthMiddleware,allOrders);
router.post('/updateorderstatus',AdminAuthMiddleware,updateOrderStatus);

/*verify payment stripe*/
router.get('/verifyStripe',authMiddleware,verifyStripe);

/*verify payment razorpay*/
router.post('/verifyRazorpay',authMiddleware,verifyRazorpay);

module.exports=router;