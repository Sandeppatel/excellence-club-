const express = require("express");
const router = express.Router();

// Controllers
const {
    getStudentDashboard
} = require("../controllers/studentDashboardController");

const {
    changeStudentPassword,
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

// Student Forgot Password Page
router.get("/forgot-password", (req, res) => {
    res.render("student/forgot-password");
});
// Student Reset Password Page
router.get("/reset-password/:token", (req, res) => {
    res.render("student/reset-password", {
        token: req.params.token
    });
});
// Student Dashboard
router.get("/dashboard", requireStudent, getStudentDashboard);

// Student Logout
router.post("/logout", requireStudent, logoutStudent);

// Student Change Password
router.put(
    "/password/change",
    requireStudent,
    changeStudentPassword
);

module.exports = router;