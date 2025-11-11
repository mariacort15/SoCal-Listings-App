const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderEmail: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    isRead: {
      type: Boolean,
      default: false,
    },
    dateSent: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;