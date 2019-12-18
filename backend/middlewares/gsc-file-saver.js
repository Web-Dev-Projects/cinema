const gscHelpers = require('../utlilty/gscHelpers');

module.exports = function (req, res, next) {
    reGroupDateFields(req.body);
    if (req.file) {
        gscHelpers.uploadFile(req.file)
            .then((fileUlr) => {
                req.body.contentFileName = fileUlr;
                next();
            })
            .catch((err) => {
                res.status(500).json(err);
            })

    } else {
        next()
    }

}

function reGroupDateFields(fields) {
    fields.date = {
        day: fields.day, month: fields.month, year: fields.year
    };

    Object.keys(fields.date, (key) => {
        delete fields[key];
    })
}