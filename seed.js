const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Property = require("./models/Property.js"); 

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env file");
  process.exit(1);
}


const properties = [
  {
    title: "Modern Family Home in Bakersfield",
    description:
      "Spacious 3-bedroom, 2-bathroom family home with a large backyard, close to schools and parks.",
    image:
      "https://images.unsplash.com/photo-1560185127-6ed189bf04bb",
    price: 2800,
    address: "123 Palm Street",
    city: "Bakersfield",
    propertyType: "House",
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    title: "Downtown Loft Apartment",
    description:
      "Stylish 1-bedroom loft with an open floor plan, great city views, and walking distance to cafes.",
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9b78825",
    price: 1995,
    address: "456 Main Ave",
    city: "Los Angeles",
    propertyType: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    title: "Luxury Beachfront Condo",
    description:
      "Ocean-view condo with modern amenities, gym access, and private parking.",
    image:
      "https://images.unsplash.com/photo-1500855515844-ffb302f0a0e",
    price: 2100,
    address: "789 Ocean Drive",
    city: "Santa Monica",
    propertyType: "Condo",
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    title: "Cozy Studio in San Diego",
    description:
      "Perfect for students or professionals. Recently renovated with all new appliances.",
    image:
      "https://images.unsplash.com/photo-1599423300746-b62533397364",
    price: 1950,
    address: "321 Hillcrest Blvd",
    city: "San Diego",
    propertyType: "Studio",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    title: "Spacious Suburban Home",
    description:
      "4-bedroom home with a large front yard, garage, and family-friendly neighborhood.",
    image:
      "https://images.unsplash.com/photo-1600855154209-30d0a4d227c1a",
    price: 3100,
    address: "654 Maple Avenue",
    city: "Irvine",
    propertyType: "House",
    bedrooms: 4,
    bathrooms: 3,
  },
];


async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Property.deleteMany();
    console.log("Cleared existing properties");

    await Property.insertMany(properties);
    console.log("Property data seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();