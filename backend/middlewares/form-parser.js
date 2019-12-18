const formidable = require('formidable');
const path = require('path')

module.exports = function (req, res, next) {
    let form = new formidable.IncomingForm({ uploadDir: process.env.CONTENTFILESPATH, keepExtensions: true, type: "text/markdown" });
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log("in form parser", err);
            res.status(500).json(err);
        } else {
            reGroupDateFields(fields);
            Object.keys(files).forEach((fileName) => {
                fields.contentFileName = path.basename(files[fileName].path);;
            });
            req.body = fields;
            next();
        }
    });
}

function reGroupDateFields(fields) {
    fields.date = {
        day: fields.day, month: fields.month, year: fields.year
    };

    Object.keys(fields.date, (key) => {
        delete fields[key];
    })
}

