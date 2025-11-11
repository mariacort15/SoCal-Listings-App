const Message = require("../models/Message.js");
const Property = require("../models/Property.js");
const User = require("../models/User.js");


const showContactForm = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { propertyId } = req.query;

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).send("Owner not found.");
    }

    
    let property = null;
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).send("Property not found.");
      }
    }

    
    res.render("contact/form", {
      owner,
      property,
      title: "Contact Owner | SoCal Listings",
    });
  } catch (error) {
    console.error("Error showing contact form:", error);
    res.status(500).send("Server Error: Unable to load contact form.");
  }
};


const sendMessage = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { senderName, senderEmail, phone, message, propertyId } = req.body;

    
    if (!senderName || !senderEmail || !message) {
      return res
        .status(400)
        .send("Name, email, and message are required.");
    }

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).send("Owner not found.");
    }

    let property = null;
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).send("Property not found.");
      }
    }

    const newMessage = new Message({
      senderName,
      senderEmail,
      phone,
      message,
      property: property ? property._id : null,
      owner: owner._id,
    });

    await newMessage.save();

   
    res.render("contact/success", {
      owner,
      senderName,
      title: "Message Sent | SoCal Listings",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Server Error: Unable to send message.");
  }
};

module.exports = {
  showContactForm,
  sendMessage,
};