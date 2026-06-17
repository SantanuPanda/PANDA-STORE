const UserModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const authMiddleware=async(req,res,next)=>{
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    } 

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:'Unauthorized'});
        }

        console.log('✅ Token verified successfully');
        console.log('   User ID:', decoded.id);
        console.log('   User email:', decoded.email);
        console.log('   User role:', decoded.role);
        
        req.user=decoded;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized', error: error.message });
    }   
  }

  module.exports=authMiddleware;