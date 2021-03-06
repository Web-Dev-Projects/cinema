const MovieModel = require("../models/movie");
const ScreenModel = require("../models/screen");
const express = require("express");
const moment = require("moment");
const authenticate = require("../middlewares/authenticate");
const adminAuthorize = require("../middlewares/adminAuthorize");
const tokenDecoder = require("../middlewares/access-token-decode");
const db = require("../db");

const moviesRouter = express.Router();
// add authentication and aouthoriations
moviesRouter.post("", (req, res) => {
    let movieData = ({ name, genre, screen, length } = req.body);
    db.findOne(ScreenModel, { sn: screen })
        .then(data => {
            if (data) {
                db.create(MovieModel, movieData)
                    .then(data => {
                        res.status(200).json(data);
                    })
                    .catch(err => {
                        console.log("in posting new movie", err);
                        res.status(500).json(err);
                    });
            } else {
                res.status(500).json({ errMsh: "wrong screen number" });
            }
        })
        .catch(err => {
            console.log("in posting new movie", err);
            res.status(500).json({ errMsh: err });
        });
});

moviesRouter.get("", (req, res) => {
    db.find(MovieModel, {})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            console.log("in getting movies", err);
            res.status(500).json(err);
        });
});

moviesRouter.get("/screenings", (req, res) => {
    db.find(MovieModel, {}, { screenings: 1 })
        .then(data => {
            // console.log("\nrammmmmmmmmmmmmmmmy\n", data);
            res.status(200).json(data);
        })
        .catch(err => {
            console.log("in getting movies", err);
            res.status(500).json(err);
        });
});

moviesRouter.get("/screenings/:movieId", (req, res) => {
    db.findOne(MovieModel, { _id: req.params.movieId }, { screenings: 1 })
        .then(data => {
            res.status(200).json(data.screenings);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

moviesRouter.put("/screenings/:movieId", (req, res) => {
    let screengingtime = new Date(moment(req.body.screengingtime).toDate());
    let movieId = req.params.movieId;
    db.findOne(MovieModel, { _id: movieId }, { screen: 1 })
        .then(movie => {
            let screen = movie.screen;
            // get all movies in same screen
            if (movie) {
                db.find(
                    MovieModel,
                    { screen: screen },
                    { screenings: 1, length: 1 }
                )
                    .then(movies => {
                        let noOverLapWithAllMovies = true;
                        movies.forEach(movie => {
                            let lenInMillsecs = movie.length * 60 * 60 * 1000;
                            if (movie.screenings.length) {
                                times = movie.screenings.map(elem => {
                                    return elem.screengingtime;
                                });
                                minDiff = times.reduce((preVal, currVal) => {
                                    return Math.min(
                                        preVal,
                                        Math.abs(currVal - screengingtime)
                                    );
                                }, lenInMillsecs); // hour to milliseconds
                                if (minDiff != lenInMillsecs) {
                                    noOverLapWithAllMovies = false;
                                    return;
                                }
                            }
                        });

                        if (noOverLapWithAllMovies) {
                            db.addElemToList(
                                MovieModel,
                                movieId,
                                "screenings",
                                { screengingtime: screengingtime }
                            )
                                .then(movie => {
                                    res.status(200).json(movie);
                                })
                                .catch(err => {
                                    res.status(500).json(err);
                                });
                        } else {
                            res.status(502).json({
                                errMsg:
                                    "there is already screening in this period"
                            });
                        }
                    })
                    .catch();
            } else {
                res.status(502).json({
                    errMsg: "there is no movie with given id"
                });
            }

            // get all screenings in that screen
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errMsg: "unexpected error" });
        });
});

moviesRouter.put("/reserve/:movieId/:screeningId", (req, res) => {
    let movieId = req.params.movieId;
    let screeningId = req.params.screeningId;
    let { row, column } = req.body;
    db.findOne(MovieModel, { _id: movieId }, { screen: 1 })
        .then(movie => {
            if (movie) {
                db.findOne(ScreenModel, { sn: movie.screen })
                    .then(data => {
                        if (
                            data &&
                            1 <= row &&
                            row <= data.rows &&
                            1 <= column &&
                            column <= data.columns
                        ) {
                            MovieModel.findOne({
                                _id: movieId,
                            })
                                .then(data => {
                                    screening = data.screenings.filter(screening => screening._id == screeningId)[0]
                                    if (screening) {
                                        reservation = screening.reservations.filter(reservation => reservation.row == row && reservation.column == column)[0]
                                        if (reservation) {
                                            res.status(502).json({
                                                reserved: false,
                                                errMsg: "wrong already reserved"
                                            });
                                        } else {
                                            data = data.toObject()
                                            screenings = data.screenings.map((screening) => {
                                                if (screening._id != screeningId)
                                                    return screening
                                                screening.reservations.push({ row, column })
                                                return screening
                                            })

                                            MovieModel.findOneAndUpdate({
                                                _id: movieId,

                                            }, { $set: { screenings: screenings } },
                                                {
                                                    new: true,
                                                    useFindAndModify: true
                                                }).then((data) => {
                                                    id = ''
                                                    screening = data.screenings.filter((screening) => screening._id == screeningId)[0]
                                                    reservation = screening.reservations.filter((reservation) => reservation.row == row && reservation.column == column)[0]
                                                    res.status(200).json({
                                                        _id: reservation._id,
                                                        reserved: true
                                                    });
                                                }).catch(err => {
                                                    res.status(500).json({
                                                        reserved: false,
                                                        errMsg: err
                                                    });
                                                });

                                        }

                                    } else {
                                        res.status(500).json({
                                            reserved: false,
                                            errMsg: "screening not found"
                                        });

                                    }
                                }).catch((err) => {
                                    console.log(err)
                                    res.status(500).json({
                                        reserved: false,
                                        errMsg: err
                                    });
                                })
                        } else {
                            res.status(502).json({
                                reserved: false,
                                errMsg: "wrong seat"
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
            } else {
                res.status(502).json({
                    reserved: false,
                    errMsg: "there is no movie with given id"
                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

moviesRouter.get("/reserve/:movieId/:screeningId", (req, res) => {
    let { movieId, screeningId } = req.params;
    db.findOne(
        MovieModel,
        { _id: movieId })
        .then(data => {
            screening = data.screenings.filter(screening => screening._id == screeningId)[0]
            if (screening) {
                res.status(200).json(screening.reservations);
            } else {
                res.status(502).json({
                    errMsg: "wrong movieid and/or screeningid"
                });
            }
        })
        .catch(err => {
            res.status(500).json({ errMsg: "unexpected error" });
        });
});

moviesRouter.get("/reserve/:movieId", (req, res) => {
    let movieId = req.params.movieId;
    db.findOne(MovieModel, { _id: movieId }, { "screenings.reservations": 1 })
        .then(data => {
            if (data) {
                res.status(200).json(data.screenings);
            } else {
                res.status(502).json({
                    errMsg: "there is no movie with given id"
                });
            }
        })
        .catch(err => {
            res.status(500).json({ errMsg: "unexpected error" });
        });
});

module.exports = moviesRouter;
