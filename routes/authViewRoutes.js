const express = require("express");
const router = express.Router();
const isSignedIn = require("../middleware/isSignedIn.js");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/sign-in", (req, res) => {
  res.render("auth/signup");
});

router.get("/dashboard", isSignedIn, (req, res) => {
  res.render("dashboard", { user: req.user });
});

router.get("/profile", isSignedIn, (req, res) => {
  res.render("profile", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;