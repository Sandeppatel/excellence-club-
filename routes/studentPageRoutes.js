const express = require("express");
const router = express.Router();

// Controllers
const {
    getStudentDashboard
} = require("../controllers/studentDashboardController");

const {
    logoutStudent
} = require("../controllers/authController");

// Middleware
const {
    requireStudent
} = require("../middleware/authMiddleware");

// Student Login Page
router.get("/login", (req, res) => {
    res.render("student/login");
});

// Student Registration Page
router.get("/register", (req, res) => {
    res.render("student/register");
});

// Student Dashboard
router.get(
    "/dashboard",
    requireStudent,
    getStudentDashboard
);

// Student Logout
router.post(
    "/logout",
    requireStudent,
    logoutStudent
);
    
module.exports = router;