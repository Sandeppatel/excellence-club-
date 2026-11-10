
const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getAllStudents,
    toggleStudentStatus,
    deleteStudent
} = require("../controllers/adminController");

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

// Manage All Students
router.get("/students", requireAdmin, getAllStudents);


router.patch(
    "/students/:id/status",
    requireAdmin,
    toggleStudentStatus,
   
);

router.delete(
    "/students/:id",
    requireAdmin,
    deleteStudent
);
// Admin Logout
router.post("/logout", requireAdmin, logoutStudent);

module.exports = router;
