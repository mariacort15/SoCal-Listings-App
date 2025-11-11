const Property = require("../models/Property.js");
const Message = require("../models/Message.js");

const getOwnerDashboard = async (req, res) => {
  try {
    
    const ownerId = req.user && req.user.id ? req.user.id : null;

    if (!ownerId) {
      
      return res.redirect("/auth/login");
    }

    
    const properties = await Property.find({ owner: ownerId })
      .sort({ datePosted: -1 });

    
    const messages = await Message.find({ owner: ownerId })
      .populate("property", "title")
      .sort({ dateSent: -1 });

    
    res.render("owners/dashboard", {
      title: "Owner Dashboard | SoCal Listings",
      owner: req.user,      
      properties,
      messages,
    });
  } catch (error) {
    console.error("Error loading Owner Dashboard:", error);
    res.status(500).send("Server Error: Could not load dashboard");
  }
};

module.exports = {
  getOwnerDashboard,
};