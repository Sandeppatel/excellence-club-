
const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    logoutStudent
} = require("../controllers/authController");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);

module.exports = router;