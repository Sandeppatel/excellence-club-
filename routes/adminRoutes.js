const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/adminController");

const {
    loginAdmin,
    logoutStudent
} = require("../controllers/authController");

const { requireAdmin } = require("../middleware/authMiddleware");

// Admin Login Page
router.get("/login", (req, res) => {
    res.render("admin/login");
});

// Admin Login API
router.post("/login", loginAdmin);

// Protected Admin Dashboard
router.get("/dashboard", requireAdmin, getDashboard);

// Admin Logout
router.post("/logout", logoutStudent);

module.exports = router;