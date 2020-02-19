const express = require("express");

// Create a router to store all the routes
const router = express.Router();

// Show the home page
router.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

module.exports = router;
