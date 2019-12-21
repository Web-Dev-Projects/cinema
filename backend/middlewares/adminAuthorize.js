module.exports = function(req, res, next) {
    if (req.headers.decodedtoken.isadmin) {
        next();
    } else {
        res.status(401).json({ msg: "Unauthorized access" });
    }
};
