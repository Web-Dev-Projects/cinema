const ScreenModel = require('../models/screen')
const express = require('express')
const db = require('../db')

const screensRouter = express.Router();

screensRouter.get('', (req, res) => {
    db.find(ScreenModel, {}, { screenings: 0 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log("in getting screen", err);
            res.status(500).json(err);
        })
});


screensRouter.get('/:screenno', (req, res) => {
    db.find(ScreenModel, { sn: req.params.screenno }, { screenings: 0 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ errMsg: "no screen with given num" });
        })
});


module.exports = screensRouter