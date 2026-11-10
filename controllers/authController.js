
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const { sendEmail } = require("../config/email");

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

// Change Student Password
const changeStudentPassword = async (req, res, next) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }

        // Validate new password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters"
            });
        }

        // Check password confirmation
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match"
            });
        }

        // Prevent using the same password
        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
            });
        }

        // Find logged-in student
        const student = await Student.findById(req.session.user.id);

        if (!student || !student.isActive) {
            return res.status(404).json({
                success: false,
                message: "Student account not found"
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            student.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        student.password = await bcrypt.hash(newPassword, 12);

        await student.save();

        // Regenerate session after password change
        const userSession = {
            id: student._id.toString(),
            fullName: student.fullName,
            email: student.email,
            role: student.role
        };

        req.session.regenerate((error) => {
            if (error) return next(error);

            req.session.user = userSession;

            req.session.save((error) => {
                if (error) return next(error);

                return res.status(200).json({
                    success: true,
                    message: "Password changed successfully"
                });
            });
        });

    } catch (error) {
        next(error);
    }
};


// Forgot Student Password
const forgotStudentPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const student = await Student.findOne({
            email: normalizedEmail,
            role: "student",
            isActive: true
        });

        // Same response whether account exists or not
        const successMessage =
            "If an account exists with this email, a password reset link has been sent.";

        if (!student) {
            return res.status(200).json({
                success: true,
                message: successMessage
            });
        }

        // Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store only the hashed token in database
        student.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Token expires after 15 minutes
        student.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await student.save();

        // Build reset URL
        const baseURL = process.env.APP_BASE_URL;

        if (!baseURL) {
            student.resetPasswordToken = null;
            student.resetPasswordExpires = null;
            await student.save();

            throw new Error("APP_BASE_URL is missing in .env");
        }

        const resetURL =
            `${baseURL.replace(/\/$/, "")}/student/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: student.email,
                subject: "Excellence Club - Password Reset",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                        <h2>Excellence Club</h2>

                        <p>We received a request to reset your password.</p>

                        <p>Click the button below to create a new password:</p>

                        <a href="${resetURL}"
                           style="display:inline-block; padding:12px 20px;
                           background:#1d4ed8; color:white;
                           text-decoration:none; border-radius:6px;">
                            Reset Password
                        </a>

                        <p>This link expires in 15 minutes.</p>

                        <p>If you did not request this, you can ignore this email.</p>

                        <p>Learn • Grow • Achieve</p>
                    </div>
                `
            });
        } catch (emailError) {
            // Remove unused token if email delivery fails
            student.resetPasswordToken = null;
            student.resetPasswordExpires = null;
            await student.save();

            throw emailError;
        }

        return res.status(200).json({
            success: true,
            message: successMessage
        });

    } catch (error) {
        next(error);
    }
};


const resetStudentPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Hash the token received from the reset link
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find student with valid, non-expired token
        const student = await Student.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
            role: "student",
            isActive: true
        });

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Password reset link is invalid or expired"
            });
        }

        // Hash and save the new password
        student.password = await bcrypt.hash(password, 12);

        // Clear reset token so it cannot be reused
        student.resetPasswordToken = null;
        student.resetPasswordExpires = null;

        await student.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login."
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    registerStudent,
    loginStudent,
    logoutStudent,
    loginAdmin,
    changeStudentPassword,
    forgotStudentPassword,
    resetStudentPassword
};