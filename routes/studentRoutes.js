const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middleware/authMiddleware");

const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

router.post("/", requireAdmin, createStudent);
router.get("/", requireAdmin, getAllStudents);
router.get("/:id", requireAdmin, getStudentById);
router.put("/:id", requireAdmin, updateStudent);
router.delete("/:id", requireAdmin, deleteStudent);

module.exports = router;