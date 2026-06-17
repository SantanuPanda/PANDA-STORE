const express=require('express');
const { loginUser, registerUser, getUserProfile, logoutUser, adminLogin, updateUserProfile } = require('../controller/user.controller');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');
const router=express.Router();
const multer=require('multer');



const upload = multer({
  storage: multer.memoryStorage(),
});

router.post('/login',validateLogin,loginUser);
router.post('/register',validateRegistration,registerUser);
router.post('/update-profile',upload.single('photo'),updateUserProfile);
router.get('/profile',getUserProfile);
router.post('/logout',logoutUser);
router.post('/admin/login',adminLogin);


module.exports=router;