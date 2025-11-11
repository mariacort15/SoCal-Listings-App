const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require("../controllers/authController.js");

const { verifyToken } = require("../middleware/authMiddleware.js");


router.post("/register", registerUser);

router.post("/login", loginUser);


router.post("/logout", logoutUser);

router.get("/me", verifyToken, getUserProfile);

module.exports = router;