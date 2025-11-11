const express = require("express");
const router = express.Router();


const { verifyToken } = require("../middleware/authMiddleware.js");


const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController.js");


const PropertyListing = require("../models/PropertyListing.js");


router.get("/", getProperties);


router.get("/:id", getPropertyById);


router.post("/", verifyToken, createProperty);


router.put("/:id", verifyToken, updateProperty);


router.delete("/:id", verifyToken, deleteProperty);


router.get("/properties/:id", async (req, res) => {
  try {
    const property = await PropertyListing.findById(req.params.id);
    if (!property)
      return res.status(404).render("404", { title: "Property Not Found" });

    res.render("properties/show", { property });
  } catch (error) {
    console.error("Error rendering property:", error.message);
    res.status(500).render("500", { title: "Server Error" });
  }
});

router.get("/search", async (req, res) => {
  const { city, minPrice, maxPrice } = req.query;
  const query = {};
  if (city) query.city = new RegExp(city, "i");
  if (minPrice) query.price = { $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

  const results = await PropertyListing.find(query);
  res.render("properties/search", { properties: results });
});


module.exports = router;