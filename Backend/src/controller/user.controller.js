
const UserModel = require("../models/user.model");

const authMiddleware = require("../middleware/auth.middleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendMail = require("../utils/email");
const { uploadToCloudinary } = require('../config/uploadCloudinary');
require("dotenv").config();


//login User
const loginUser = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.findOne({ email: email.trim() }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging in user",
      error: error.message,
    });
  }
};


//Register User — Step 1: Send OTP (creates unverified user in DB)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.isverified) {
      return res.json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit OTP valid for 10 minutes
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save/update unverified user directly in UserModel
    await UserModel.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, otp, otpExpiry, isverified: false },
      { upsert: true, new: true }
    );

    // Send OTP to user's email
    await SendMail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration."
    });

  } catch (error) {
    console.error("❌ Register error:", error.message);
    res.json({
      success: false,
      message: "Error sending OTP: " + error.message,
    });
  }
};


//Register User — Step 2: Verify OTP and activate user
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {

    const user = await UserModel.findOne({ email });

    if (!user || user.isverified) {
      return res.json({
        success: false,
        message: "No pending registration found. Please register again."
      });
    }

    // Check OTP expiry
    if (!user.otpExpiry || Date.now() > new Date(user.otpExpiry).getTime()) {
      return res.json({
        success: false,
        message: "OTP has expired. Please register again."
      });
    }

    // Check OTP value
    if (user.otp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP. Please try again."
      });
    }

    // OTP correct — mark user as verified and clear OTP fields
    await UserModel.findByIdAndUpdate(user._id, {
      isverified: true,
      otp: null,
      otpExpiry: null
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).json({
      success: true,
      message: "Email verified. User registered successfully.",
      token,
      newUser: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.json({
      success: false,
      message: "Error verifying OTP",
      error: error.message
    });
  }
};


//Get User Profile
const getUserProfile=async(req,res)=>{
 try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'User profile retrieved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { name} = req.body;
    const photoFile = req.file;
    let photoUrl;

    if (photoFile) {
      const uploadResult = await uploadToCloudinary(photoFile.buffer, 'profile_photos');
      photoUrl = uploadResult.secure_url;
    }

    const user = await UserModel.findByIdAndUpdate(decoded.id,{ name,photo: photoUrl },{ new: true }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/*ADMIN LOGIN*/
const adminLogin=async(req,res)=>{
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

      const token = jwt.sign(
        { email: email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("adminToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Admin login successful",
          token
        });
    } else {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error logging in admin", error: error.message });
  }
}

//logout User
const logoutUser = async (req, res) => {
  try {

    res.clearCookie("token");
    res.clearCookie("adminToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
};


module.exports={
  loginUser,
  registerUser,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  adminLogin
}