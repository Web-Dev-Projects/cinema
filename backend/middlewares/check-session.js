module.exports = function (req, res, next) {
    if (req.headers.sid) {
        next();
    } else {
        res.status(400).json({ errmsg: "no sid provided" });
    }
};