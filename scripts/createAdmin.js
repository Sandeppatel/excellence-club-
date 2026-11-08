
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const createAdmin = async () => {
    try {
        const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Required environment variables are missing");
        }

        if (ADMIN_PASSWORD.length < 12) {
            throw new Error("Admin password must be at least 12 characters");
        }

        await mongoose.connect(MONGO_URI);

        const email = ADMIN_EMAIL.trim().toLowerCase();

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        await Admin.create({
            fullName: ADMIN_NAME,
            email,
            password: hashedPassword
        });

        console.log("Admin account created successfully!");

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
