const path = require('path')
const fs = require('fs')

module.exports = function (req, res, next) {
    let { files, fields } = req.body;
    let uniqueHash = '';
    Object.keys(files).forEach((fileName) => {
        let oldpath = files[fileName].path;
        let oldFileName = path.basename(oldpath);

        uniqueHash = uniqueHash || oldFileName.split('_')[1];
        let newFileName = uniqueHash + '_' + files[fileName].name;

        fields.contentFileName = newFileName;
        let newpath = path.join(process.env.CONTENTFILESPATH, newFileName);

        fs.readFile(oldpath, 'utf8', (err, data) => {
            if (err) {
                console.log("in filesaver (reading)", err);
                return res.status(500).json({ err: "err in saving file" });
            }

            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.log("in filesaver (moving)", err);
                    res.status(500).json(err)
                }
            });

        });
    });

    req.body = fields;
    next();
}
