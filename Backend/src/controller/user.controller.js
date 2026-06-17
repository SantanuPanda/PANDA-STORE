
const UserModel = require("../models/user.model");
const authMiddleware = require("../middleware/auth.middleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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


//Register User — Direct registration (no OTP)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user directly
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id },
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
      .json({
        success: true,
        message: "Account created successfully!",
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });

  } catch (error) {
    console.error("❌ Register error:", error.message);
    res.json({
      success: false,
      message: "Error registering user",
      error: error.message,
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
  getUserProfile,
  updateUserProfile,
  logoutUser,
  adminLogin
}