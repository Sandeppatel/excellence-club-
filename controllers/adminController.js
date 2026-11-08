const Student = require("../models/Student");
const Course = require("../models/Course");

const getDashboard = async (req, res, next) => {
    try {
        const totalStudents = await Student.countDocuments();

        const activeStudents = await Student.countDocuments({
            isActive: true
        });

        const totalCourses = await Course.countDocuments();

        const publishedCourses = await Course.countDocuments({
            isPublished: true
        });

        const recentStudents = await Student.find()
            .select("fullName email class createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

        res.render("admin/dashboard", {
            admin: req.session.user,
            totalStudents,
            activeStudents,
            totalCourses,
            publishedCourses,
            recentStudents
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboard };