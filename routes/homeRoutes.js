const express = require("express");
const router = express.Router();

const { getHomePage } = require("../controllers/homeController");

// Homepage route
router.get("/", getHomePage);

module.exports = router;