
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

// Student Registration
const registerStudent = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword, class: studentClass } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !confirmPassword || !studentClass) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Password length validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Check existing email
        const existingStudent = await Student.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create student
        const student = await Student.create({
            fullName,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            class: studentClass,
            role: "student"
        });

        // Create session
        req.session.user = {
            id: student._id.toString(),
            fullName: student.fullName,
            email: student.email,
            role: student.role
        };

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
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


const loginStudent = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find student
        const student = await Student.findOne({
            email: email.trim().toLowerCase()
        });

        if (!student || !student.isActive || student.role !== "student") {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Regenerate session to prevent session fixation
        req.session.regenerate((error) => {
            if (error) return next(error);

            req.session.user = {
                id: student._id.toString(),
                fullName: student.fullName,
                email: student.email,
                role: student.role
            };

            req.session.save((error) => {
                if (error) return next(error);

                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    data: {
                        id: student._id,
                        fullName: student.fullName,
                        email: student.email,
                        role: student.role
                    }
                });
            });
        });

    } catch (error) {
        next(error);
    }
};


const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find Admin
        const admin = await Admin.findOne({
            email: email.trim().toLowerCase()
        });

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Regenerate session
        req.session.regenerate((error) => {
            if (error) return next(error);

            req.session.user = {
                id: admin._id.toString(),
                fullName: admin.fullName,
                email: admin.email,
                role: "admin"
            };

            req.session.save((error) => {
                if (error) return next(error);

                res.status(200).json({
                    success: true,
                    message: "Admin login successful",
                    data: {
                        id: admin._id,
                        fullName: admin.fullName,
                        email: admin.email,
                        role: "admin"
                    }
                });
            });
        });

    } catch (error) {
        next(error);
    }
};


const logoutStudent = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie("connect.sid");

        // Browser page request
        if (req.accepts("html")) {
            return res.redirect("/student/login");
        }

        // API request
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    });
};

module.exports = {
    registerStudent,
    loginStudent,
    logoutStudent,
    loginAdmin
};