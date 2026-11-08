
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Homepage route
app.get("/", (req, res) => {
    res.render("home");
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Excellence Club running at http://localhost:${PORT}`);
});
