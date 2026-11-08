
const Student = require("../models/Student");

// Update Student Profile
const updateStudentProfile = async (req, res, next) => {
    try {
        const { fullName, email } = req.body;

        // Validate required fields
        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Clean input
        const updatedName = fullName.trim();
        const updatedEmail = email.trim().toLowerCase();

        if (updatedName.length < 2 || updatedName.length > 60) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 60 characters"
            });
        }

        // Check duplicate email
        const existingStudent = await Student.findOne({
            email: updatedEmail,
            _id: { $ne: req.session.user.id }
        });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered"
            });
        }

        // Update profile
        const student = await Student.findByIdAndUpdate(
            req.session.user.id,
            {
                fullName: updatedName,
                email: updatedEmail
            },
            {
                 returnDocument: "after",
                 runValidators: true
            }
        ).select("-password");

        if (!student || !student.isActive) {
            return res.status(404).json({
                success: false,
                message: "Student account not found or inactive"
            });
        }

        // Update session details
        req.session.user.fullName = student.fullName;
        req.session.user.email = student.email;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            student: {
                fullName: student.fullName,
                email: student.email,
                class: student.class
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateStudentProfile
};
