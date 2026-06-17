const express=require('express');
const router=express.Router();
const { createProduct,getAllProducts,removeProductById,GetsingleProductById} = require('../controller/product.controller');
const adminAuthMiddleware=require('../middleware/admin.auth');
const multer=require('multer');



const upload = multer({
  storage: multer.memoryStorage(),
});

router.post('/createproduct',adminAuthMiddleware,upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]),createProduct);

router.get('/getallproducts',getAllProducts);
router.delete('/deleteproduct',adminAuthMiddleware,removeProductById);
router.get('/getproductbyid',GetsingleProductById);


module.exports=router;