const Property = require("../models/Property.js");
const PropertyListing = require("../models/PropertyListing.js");


const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    res.status(500).json({ message: error.message });
  }
};


const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error.message);
    res.status(500).json({ message: error.message });
  }
};


const createProperty = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const role = req.user?.role;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized: No user ID" });

    if (role !== "Owner" && role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Owners or Admins can add properties" });
    }

    const property = new Property({
      ...req.body,
      owner: userId,
    });

    await property.save();
    console.log("New property created:", property.title || property._id);

    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error.message);
    res.status(500).json({ message: error.message });
  }
};


const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const userId = req.user?._id || req.user?.id;
    const role = req.user?.role;

    if (property.owner.toString() !== userId && role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    console.log("✏️ Property updated:", updated.title || updated._id);
    res.json(updated);
  } catch (error) {
    console.error("Error updating property:", error.message);
    res.status(500).json({ message: error.message });
  }
};


const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const userId = req.user?._id || req.user?.id;
    const role = req.user?.role;

    if (property.owner.toString() !== userId && role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await property.deleteOne();
    console.log("Property deleted:", property.title || property._id);

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};