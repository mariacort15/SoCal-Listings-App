const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");


function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}


async function registerUser(req, res) {
  try {
    const { fullName, email, password, role, phone } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email, and password are required." });
    }

    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email already registered." });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "Tenant",
      phone,
    });

    
    const token = generateToken(user);

    
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
}


async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
}


function logoutUser(req, res) {
  
  res.status(200).json({ message: "User logged out successfully." });
}


async function getUserProfile(req, res) {
  try {
    
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Error fetching profile." });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};