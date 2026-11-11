
const Student = require("../models/Student");
const Course = require("../models/Course");

// STUDENT DASHBOARD
const getStudentDashboard = async (req, res, next) => {
    try {
        // Get logged-in student
        const student = await Student.findById(
            req.session.user.id
        ).select("-password");

        // Check student status
        if (!student || !student.isActive) {
            req.session.destroy(() => {});
            return res.redirect("/student/login");
        }

        // DEBUG: Check all published courses
        const allPublishedCourses = await Course.find({
            isPublished: true
        });

        console.log("\n========== COURSE DEBUG ==========");
        console.log("Student ID:", student._id);
        console.log("Student Class:", JSON.stringify(student.class));

        console.log(
            "All Published Courses:",
            allPublishedCourses.map(course => ({
                id: course._id,
                title: course.title,
                class: course.class,
                isPublished: course.isPublished
            }))
        );

        // Get published courses matching student's class
        const courses = await Course.find({
            class: student.class,
            isPublished: true
        }).select("title subject description thumbnail class");

        console.log("Matching Courses:", courses.length);
        console.log("==================================\n");

        // Render student dashboard
        res.render("student/dashboard", {
            student,
            courses
        });

    } catch (error) {
        next(error);
    }
};


// STUDENT COURSE DETAILS
const getStudentCourseDetails = async (req, res, next) => {
    try {
        const student = await Student.findById(
            req.session.user.id
        ).select("-password");

        // Check student status
        if (!student || !student.isActive) {
            req.session.destroy(() => {});
            return res.redirect("/student/login");
        }

        // Find published course for student's class only
        const course = await Course.findOne({
            _id: req.params.id,
            class: student.class,
            isPublished: true
        });

        if (!course) {
            return res.status(404).render("404", {
                message: "Course not found or access denied"
            });
        }

        // Render course details page
        res.render("student/course-details", {
            student,
            course
        });

    } catch (error) {
        next(error);
    }
};


// EXPORT CONTROLLERS
module.exports = {
    getStudentDashboard,
    getStudentCourseDetails
};
