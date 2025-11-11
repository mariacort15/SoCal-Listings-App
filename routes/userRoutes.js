const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Property = require("../models/PropertyListing");
const { saveProperty, unsaveProperty } = require('../controllers/userController');

router.get("/profile", verifyToken, async (req, res) => {
  res.render("users/profile", { user: req.user });
});


router.get("/my-listings", verifyToken, async (req, res) => {
  if (req.user.role !== "Owner") {
    return res.status(403).send("Access denied");
  }

  const listings = await Property.find({ listingAgent: req.user._id });
  res.render("users/my-listings", { listings });
});


router.post("/update", verifyToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    );
    res.redirect("/users/profile");
  } catch (err) {
    res.send("Update failed");
  }
});

router.post('/save/:id', verifyToken, saveProperty);

router.delete('/unsave/:id', verifyToken, unsaveProperty);

module.exports = router