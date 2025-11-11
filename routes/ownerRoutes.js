const express = require("express");
const router = express.Router();


const { verifyToken } = require("../middleware/authMiddleware.js");
const Property = require("../models/PropertyListing.js");
const Message = require("../models/Message.js");
const { getOwnerDashboard } = require("../controllers/ownerController.js");

router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const owner = req.user;

   
    const properties = await Property.find({ owner: owner._id })
      .sort({ datePosted: -1 });


    const messages = await Message.find({ owner: owner._id })
      .populate("property", "title")
      .sort({ dateSent: -1 });

    
    res.render("owners/dashboard", {
      title: "Owner Dashboard | SoCal Listings",
      owner,
      properties,
      messages,
    });
  } catch (err) {
    console.error("Error loading Owner Dashboard:", err);
    res.status(500).send("Server Error: Could not load Owner Dashboard");
  }
});


module.exports = router;