
const express = require("express");
const router = express.Router();

// Admin Controller
const {
    getDashboard,
    getAllStudents,
    toggleStudentStatus,
    deleteStudent
} = require("../controllers/adminController");

// Authentication Controller
const {
    loginAdmin,
    logoutStudent
} = require("../controllers/authController");

// Authentication Middleware
const { requireAdmin } = require("../middleware/authMiddleware");

// Course Controller
const {
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    toggleCoursePublish,
    getAdminCoursesPage,
    getCreateCoursePage,
    getEditCoursePage
} = require("../controllers/courseController");

// =================================
// ADMIN AUTHENTICATION
// =================================

router.get("/login", (req, res) => {
    res.render("admin/login");
});

router.post("/login", loginAdmin);

router.post("/logout", requireAdmin, logoutStudent);

// =================================
// ADMIN DASHBOARD
// =================================

router.get("/dashboard", requireAdmin, getDashboard);

// =================================
// STUDENT MANAGEMENT
// =================================

router.get("/students", requireAdmin, getAllStudents);

router.patch(
    "/students/:id/status",
    requireAdmin,
    toggleStudentStatus
);

router.delete(
    "/students/:id",
    requireAdmin,
    deleteStudent
);

// =================================
// COURSE MANAGEMENT
// =================================

// Course listing page
router.get(
    "/courses",
    requireAdmin,
    getAdminCoursesPage
);

// Create course page
// Static route must come before dynamic :id route
router.get(
    "/courses/create",
    requireAdmin,
    getCreateCoursePage
);

// Create course API
router.post(
    "/courses",
    requireAdmin,
    createCourse
);

// Get single course
router.get(
    "/courses/:id",
    requireAdmin,
    getCourseById
);

// Update course
router.put(
    "/courses/:id",
    requireAdmin,
    updateCourse
);

// Delete course
router.delete(
    "/courses/:id",
    requireAdmin,
    deleteCourse
);

// Publish / Unpublish course
router.patch(
    "/courses/:id/publish",
    requireAdmin,
    toggleCoursePublish
);

router.get("/courses/edit/:id", requireAdmin, getEditCoursePage);

module.exports = router;
