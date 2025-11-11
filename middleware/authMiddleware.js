const jwt = require("jsonwebtoken");
const User = require("../models/User.js");


const verifyToken = async (req, res, next) => {
  try {
    let token;

    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    
    req.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    next(); 
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient privileges." });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };