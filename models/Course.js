const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true
        },

        class: {
            type: String,
            required: true,
            enum: ["9th", "10th", "11th", "12th"]
        },

        description: {
            type: String,
            required: true
        },

        thumbnail: {
            type: String,
            default: ""
        },

        isPublished: {
            type: Boolean,
            default: false
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);