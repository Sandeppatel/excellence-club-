// Render Homepage
const getHomePage = (req, res) => {
    res.render("home", {
        title: "Excellence Club | Learn • Grow • Achieve"
    });
};

module.exports = {
    getHomePage
};