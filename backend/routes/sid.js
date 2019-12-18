const express = require('express');
const SidModel = require('../models/sid');

const sidRouter = express.Router();

sidRouter.get('', (req, res) => {
    SidModel.findOneAndUpdate({}, { $inc: { sid: 1 } }, { useFindAndModify: false, new: false })
        .then((data) => {
            if (data) {
                res.status(200).json(data.sid);
            } else {
                SidModel.create({ sid: 1 })
                    .then((data) => {
                        res.status(200).json(data.sid);
                    }).catch((err) => {
                        console.log("in creating sid", err)
                        res.status(500).json(data.sid);
                    });

            }
        })
        .catch((err) => {
            console.log("in creating sid", err)
            res.status(500).json(data.sid);
        });
});

module.exports = sidRouter