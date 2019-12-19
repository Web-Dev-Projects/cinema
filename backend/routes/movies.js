const MovieModel = require('../models/movie')
const ScreenModel = require('../models/screen')
const authenticate = require('../middlewares/authenticate');
const express = require('express')
// const checkSession = require('../middlewares/check-session')
// const tokenDecoder = require('../middlewares/access-token-decode')
const db = require('../db')

const moviesRouter = express.Router();

moviesRouter.post('', (req, res) => {
    let movieData = { name, genre, screen, length } = req.body;
    db.create(MovieModel, req.body)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log("in posting new movie", err);
            res.status(500).json(err);
        });
});

moviesRouter.get('', (req, res) => {
    db.find(MovieModel, {}, { screenings: 0 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log("in getting movies", err);
            res.status(500).json(err);
        })
});


moviesRouter.get('/screenings', (req, res) => {
    db.find(MovieModel, {}, { screenings: 1 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log("in getting movies", err);
            res.status(500).json(err);
        })
});

moviesRouter.get('/screenings/:movieId', (req, res) => {
    db.findOne(MovieModel, { _id: req.params.movieId }, { screenings: 1 })
        .then(data => {
            res.status(200).json(data.screenings);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
});


moviesRouter.put('/screenings/:movieId', (req, res) => {
    let screengingtime = new Date(req.body.screengingtime);
    let movieId = req.params.movieId;
    db.findOne(MovieModel, { _id: movieId }, { screenings: 1, length: 1 })
        .then(data => {
            if (data) {
                let lenInMillsecs = data.length * 60 * 60 * 1000;
                times = data.screenings.map((elem) => { return elem.screengingtime })
                minDiff = times.reduce((preVal, currVal) => {
                    return Math.min(preVal, Math.abs(currVal - screengingtime));
                }, lenInMillsecs) // hour to milliseconds
                nonoverlap = minDiff == lenInMillsecs;
                if (nonoverlap) {
                    db.addElemToList(MovieModel, movieId, "screenings", { screengingtime: screengingtime })
                        .then(data => {
                            res.status(200).json(data);
                        })
                        .catch((err) => {
                            res.status(500).json(err);
                        })

                } else {
                    res.status(502).json({ errMsg: "there is already screening in this period" });
                }
            } else {
                res.status(502).json({ errMsg: "there is no movie with given id" });
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ errMsg: "unexpected error" });
        })
});


moviesRouter.put('/reserve/:movieId/:screeningId', (req, res) => {
    let movieId = req.params.movieId
    let screeningId = req.params.screeningId
    let { row, column } = req.body
    db.findOne(MovieModel, { _id: movieId }, { screen: 1 })
        .then(movie => {
            if (movie) {
                db.findOne(ScreenModel, { sn: movie.screen })
                    .then((data) => {
                        if (data && (0 <= row && row < data.rows) && (0 <= column && column < data.columns)) {
                            MovieModel.findOne({
                                _id: movieId, 'screenings._id': screeningId,
                                "screenings.reservations": { $elemMatch: { row: row, column: column } }
                            })
                                .then((data) => {
                                    if (data) {
                                        res.status(502).json({ reserved: false, errMsg: "wrong already reserved" });
                                    } else {
                                        MovieModel.updateOne({
                                            _id: movieId, 'screenings._id': screeningId
                                        }, { $addToSet: { "screenings.$.reservations": { row, column } } })
                                            .then(() => {
                                                res.status(200).json({ reserved: true });
                                            })
                                            .catch((err) => {
                                                res.status(500).json({ reserved: false, errMsg: err });
                                            })
                                    }
                                })

                        } else {
                            res.status(502).json({ reserved: false, errMsg: "wrong seat" });
                        }

                    })
                    .catch(err => {
                        res.status(500).json(err);
                    })
            } else {
                res.status(502).json({ reserved: false, errMsg: "there is no movie with given id" });
            }

        }).catch(err => {
            res.status(500).json(err);
        })
});


moviesRouter.get('/reserve/:movieId/:screeningId', (req, res) => {
    let { movieId, screeningId } = req.params
    db.findOne(MovieModel, { _id: movieId, "screenings._id": screeningId }, { "screenings.reservations": 1 })
        .then(data => {
            if (data) {
                res.status(200).json(data.screenings[0].reservations);
            } else {
                res.status(502).json({ errMsg: "wrong movieid and/or screeningid" });
            }
        }).catch((err) => {
            res.status(500).json({ errMsg: "unexpected error" });
        })
});


moviesRouter.get('/reserve/:movieId', (req, res) => {
    let movieId = req.params.movieId
    db.findOne(MovieModel, { _id: movieId }, { "screenings.reservations": 1 })
        .then(data => {
            if (data) {
                res.status(200).json(data.screenings);
            } else {
                res.status(502).json({ errMsg: "there is no movie with given id" });
            }
        }).catch((err) => {
            res.status(500).json({ errMsg: "unexpected error" });
        })
});

module.exports = moviesRouter