
const express = require("express");
const router = express.Router();

// Controller
const {
    updateStudentProfile
} = require("../controllers/studentProfileController");

// Middleware
const {
    requireStudent
} = require("../middleware/authMiddleware");

// Update Student Profile
router.put(
    "/update",
    requireStudent,
    updateStudentProfile
);

module.exports = router;
