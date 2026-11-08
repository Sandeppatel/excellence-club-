const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middleware/authMiddleware");
const {
    createCourse,
    getAllCourses,
    getCourseById,  
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

router.post("/", requireAdmin, createCourse);

router.get("/", requireAdmin, getAllCourses);

router.get("/:id", requireAdmin, getCourseById);

router.put("/:id", requireAdmin, updateCourse);

router.delete("/:id", requireAdmin, deleteCourse);

module.exports = router;