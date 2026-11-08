const Student = require("../models/Student");
const bcrypt = require("bcrypt");
// CREATE Student
const createStudent = async (req, res, next) => {
    try {
        const { fullName, email, password, class: studentClass } = req.body;

        if (!fullName || !email || !password || !studentClass) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const student = await Student.create({
            fullName,
            email,
            password: hashedPassword,
            class: studentClass
        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: {
                id: student._id,
                fullName: student.fullName,
                email: student.email,
                class: student.class
            }
        });
    } catch (error) {
        next(error);
    }
};

// READ All Students
const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find().select("-password");

        res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        next(error);
    }
};

// READ Single Student
const getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE Student
const updateStudent = async (req, res, next) => {
    try {
        const allowedFields = ["fullName", "email", "class", "isActive"];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// DELETE Student
const deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

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
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};

