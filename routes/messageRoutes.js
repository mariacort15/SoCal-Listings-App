const express = require("express");
const router = express.Router();

const {
  showContactForm,
  sendMessage,
} = require("../controllers/messageController.js");

router.get("/contact-owner/:ownerId", showContactForm);

router.post("/contact-owner/:ownerId", sendMessage);

module.exports = router;