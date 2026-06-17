const JWT=require('jsonwebtoken');
require('dotenv').config();


const adminAuthMiddleware=async(req,res,next)=>{
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: 'Admin not authenticated' });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
}

module.exports=adminAuthMiddleware;