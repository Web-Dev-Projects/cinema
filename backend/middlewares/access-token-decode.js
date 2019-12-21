const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    try {
        jwt.verify(req.headers.accesstoken, "cinema");
        req.headers.decodedtoken = jwt.decode(req.headers.accesstoken);
    } catch (err) {
        console.log("in token decoding ", err.message);
        req.headers.decodedtoken = null;
    }
    next();
};
