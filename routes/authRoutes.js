
const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    logoutStudent,
    forgotStudentPassword,
    resetStudentPassword
} = require("../controllers/authController");

// Student Authentication
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);

// Forgot Password
router.post("/forgot-password", forgotStudentPassword);

// Reset Password
router.post("/reset-password/:token", resetStudentPassword);

module.exports = router;
