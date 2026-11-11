const Course = require("../models/Course");

// CREATE COURSE
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

        // Get logged-in admin ID from session
        const adminId = req.session.user.id;

        const course = await Course.create({
            title: title.trim(),
            subject: subject.trim(),
            class: courseClass,
            description: description.trim(),
            thumbnail: thumbnail || "",
            createdBy: adminId
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


// RENDER ADMIN COURSES PAGE
const getAdminCoursesPage = async (req, res, next) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        res.render("admin/courses/index", {
            courses,
            admin: req.session.user
        });

    } catch (error) {
        next(error);
    }
};

// RENDER CREATE COURSE PAGE
const getCreateCoursePage = (req, res) => {
    res.render("admin/courses/create", {
        admin: req.session.user
    });
};

const getEditCoursePage = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).send("Course not found");
        }

        res.render("admin/courses/edit", {
            course,
            admin: req.session.user
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


// TOGGLE COURSE PUBLISH STATUS
const toggleCoursePublish = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        course.isPublished = !course.isPublished;

        await course.save();

        res.status(200).json({
            success: true,
            message: course.isPublished
                ? "Course published successfully"
                : "Course unpublished successfully",
            data: course
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
    deleteCourse,
    toggleCoursePublish,
    getAdminCoursesPage,
    getCreateCoursePage,
    getEditCoursePage
};