const Student = require("../models/Student");
const Course = require("../models/Course");

// Student Dashboard
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

        // Get published courses for student's class
        const courses = await Course.find({
            class: student.class,
            isPublished: true
        }).select("title subject description thumbnail class");

        // Render dashboard
        res.render("student/dashboard", {
            student,
            courses
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStudentDashboard
};