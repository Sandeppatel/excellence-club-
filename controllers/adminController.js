
const Student = require("../models/Student");
const Course = require("../models/Course");

// Admin Dashboard
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

// Get All Students
const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find()
            .select("-password -resetPasswordToken -resetPasswordExpires")
            .sort({ createdAt: -1 });

        res.render("admin/students", {
            admin: req.session.user,
            students
        });

    } catch (error) {
        next(error);
    }
};


// Activate / Deactivate Student
const toggleStudentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const student = await Student.findOne({
            _id: id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.isActive = !student.isActive;

        await student.save();

        res.json({
            success: true,
            message: student.isActive
                ? "Student activated successfully"
                : "Student deactivated successfully",
            isActive: student.isActive
        });

    } catch (error) {
        next(error);
    }
};

// Delete Student
const deleteStudent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const student = await Student.findOneAndDelete({
            _id: id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
    getAllStudents,
    toggleStudentStatus,
    deleteStudent
};
