require("dotenv").config();

const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");
const studentPageRoutes = require("./routes/studentPageRoutes");

const session = require("express-session");

const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo;

const path = require("path");

const connectDB = require("./config/database");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session Configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// Routes
const homeRoutes = require("./routes/homeRoutes");
app.use("/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentPageRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student/profile", studentProfileRoutes);

// Error middleware
const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

// Start server after database connection
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Excellence Club running at http://localhost:${PORT}`);
    });
};

startServer();