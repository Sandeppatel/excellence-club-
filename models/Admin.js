const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
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

        permissions: {
            type: [String],
            default: ["manage_students", "manage_courses", "manage_resources"]
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);  

module.exports = mongoose.model("Admin", adminSchema);