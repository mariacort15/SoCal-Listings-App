const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["Owner", "Tenant", "Admin"],
    default: "Tenant",
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  profileImage: {
    type: String,
    default:
      "https://res.cloudinary.com/demo/image/upload/v1692380310/default-user.png",
  },
  propertiesOwned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  propertyRented: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  savedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model("User", userSchema);
module.exports = User;