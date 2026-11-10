const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        class: {
            type: String,
            required: true,
            enum: ["9th", "10th", "11th", "12th"]
        },

        role: {
            type: String,
            default: "student",
            enum: ["student", "admin"]
        },

        isActive: {
            type: Boolean,
            default: true
        },
        resetPasswordToken: {
            type: String,
            default: null
        },

        resetPasswordExpires: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);