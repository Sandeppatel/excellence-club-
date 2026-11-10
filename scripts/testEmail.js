
require("dotenv").config();

const { sendEmail } = require("../config/email");

const testEmail = async () => {
    try {
        await sendEmail({
            email: process.env.EMAIL_USER,
            subject: "Excellence Club - Email Test",
            html: `
                <h2>Welcome to Excellence Club!</h2>
                <p>Your Gmail email configuration is working successfully.</p>
                <p>Learn • Grow • Achieve</p>
            `
        });

        console.log("Test email sent successfully!");

    } catch (error) {
        console.error("Test failed:", error.message);
    }
};

testEmail();
