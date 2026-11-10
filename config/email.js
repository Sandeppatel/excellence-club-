
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Send Email Function
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"Excellence Club" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully:", info.messageId);

        return info;

    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
    }
};

module.exports = {
    sendEmail
};
