
const requireAdmin = (req, res, next) => {

    if (!req.session || !req.session.user) {

        if (req.originalUrl.startsWith("/api/")) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        return res.redirect("/admin/login");
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    next();
};


// Student Authentication Middleware
const requireStudent = (req, res, next) => {

    if (!req.session || !req.session.user) {

        if (req.originalUrl.startsWith("/api/")) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        return res.redirect("/student/login");
    }

    if (req.session.user.role !== "student") {
        return res.status(403).send("Access Denied: Student only");
    }

    next();
};


module.exports = {
    requireAdmin,
    requireStudent
};
