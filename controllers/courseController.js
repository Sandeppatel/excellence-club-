const Course = require("../models/Course");

// CREATE COURSE
const createCourse = async (req, res, next) => {
    try {
        const {
            title,
            subject,
            class: courseClass,
            description,
            thumbnail
        } = req.body;

        if (!title || !subject || !courseClass || !description) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const course = await Course.create({
            title,
            subject,
            class: courseClass,
            description,
            thumbnail
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL COURSES
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

// GET SINGLE COURSE
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE COURSE
const updateCourse = async (req, res, next) => {
    try {
        const allowedFields = [
            "title",
            "subject",
            "class",
            "description",
            "thumbnail",
            "isPublished"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// DELETE COURSE
const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};