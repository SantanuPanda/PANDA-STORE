const UserModel=require("../models/user.model");
const authMiddleware=require("../middleware/auth.middleware");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();


const addToCart=async(req,res)=>{
  try {

    const userId=req.user.id;
    const {productId,size}=req.body;

    const userData=await UserModel.findById(userId);
    let cartData=await userData.cartData;

    if(!userData){
      return res.status(404).json({message:'User not found'});
    }

    if(cartData && cartData[productId]){
      if(cartData[productId][size]){
        cartData[productId][size]+=1;
      }
      else{
        cartData[productId][size]=1;
      }
    }
    else{
      cartData[productId]={};
      cartData[productId][size]=1;
    }

    await UserModel.findByIdAndUpdate(userId,{cartData},{new:true});

    return res.status(200).json({ success: true, message: 'Product added to cart successfully', cartData: cartData });

    
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}

const getCart=async(req,res)=>{
  try {
    const userId=req.user.id;
    const userData=await UserModel.findById(userId);
    let cartData=await userData.cartData;
    
    return res.status(200).json({ success: true, message: 'Cart retrieved successfully',cartData });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}

const UpdateCart=async(req,res)=>{
  try {
    const userId=req.user.id;
    const {productId,size,quantity}=req.body;
    const userData=await UserModel.findById(userId);
    let cartData=await userData.cartData;

    if(!userData){
      return res.status(404).json({message:'User not found'});
    }

    cartData[productId][size]=quantity;

    await UserModel.findByIdAndUpdate(userId,{cartData},{new:true});

    return res.status(200).json({ success: true, message: 'Cart updated successfully', cartData: cartData });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}

module.exports={addToCart,getCart,UpdateCart}