const ScreenModel = require('../models/screen')
const express = require('express')
const db = require('../db')

const screensRouter = express.Router();


screensRouter.post('', (req, res) => {
    db.create(ScreenModel, req.body)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log("in creating new screen", err);
            res.status(502).json({ errMsg: err.errmsg });
        });
});


screensRouter.get('', (req, res) => {
    db.find(ScreenModel)
        .then(data => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log("in getting screen", err);
            res.status(500).json(err);
        })
});


screensRouter.get('/:screenno', (req, res) => {
    db.find(ScreenModel, { sn: req.params.screenno })
        .then(data => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ errMsg: "no screen with given num" });
        })
});


module.exports = screensRouter