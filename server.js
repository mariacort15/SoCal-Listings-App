const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const morgan = require("morgan");


const propertyRoutes = require("./routes/propertyRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const authApiRoutes = require("./routes/authApiRoutes.js");
const authViewRoutes = require("./routes/authViewRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const ownerRoutes = require("./routes/ownerRoutes.js");
const userRoutes = require("./routes/userRoutes.js");


const Property = require("./models/Property.js");


dotenv.config();


const app = express();


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/api/auth", authApiRoutes);
app.use("/auth", authViewRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/owner", ownerRoutes);
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);


app.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.render("index", { properties });
  } catch (error) {
    console.error("Error loading properties:", error);
    res.status(500).send("Server Error");
  }
});


app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));