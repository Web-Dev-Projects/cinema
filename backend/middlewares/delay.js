module.exports = function (req, res, next) {
    for (let index = 0; index < 600000000; index++) {
    }
    next();
}
