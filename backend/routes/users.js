const express = require('express');
const UserModel = require('../models/user');
const db = require('../db');
const jwt = require('jsonwebtoken');
const checkSession = require('../middlewares/check-session')
const auth = require('../middlewares/authenticate')

const usersRouter = express.Router();

usersRouter.post('/signin', (req, res) => {
    db.findOne(UserModel, { username: req.body.username, password: req.body.password })
        .then((user) => {
            if (user) {
                const isadmin = user.isadmin ? user.isadmin : false;
                res.status(200).json({ accessToken: jwt.sign({ username: user.username, password: user.password, isadmin: isadmin }, 'cinema') });
            } else {
                res.status(401).json({ msg: "username or/and password is wrong." })
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        })
});

usersRouter.post('/signup', (req, res) => {
    let userData = { username, password, firstname, lastname, email, birthdate } = req.body;
    userData.birthdate = Date(birthdate)
    db.findOne(UserModel, { username: userData.username })
        .then((user) => {
            if (user) {
                res.status(400).json({ msg: "username already exists" });
            } else {
                db.create(UserModel, userData)
                    .then(() => {
                        res.status(200).json({ msg: "Data successfully added to database", data: userData });
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    })
            }
        }).catch((err) => {
            res.status(500).json(err);
        })
});



usersRouter.get('', (req, res) => {
    db.find(UserModel)
        .then((users) => {
            res.status(400).json(users)
        }).catch((err) => {
            res.status(500).json(err);
        })
});


//TODO authenticate using auth middileware
usersRouter.put('/setadmin/:username', (req, res) => {
    let username = req.params.username

    db.findOne(UserModel, { username: username })
        .then((user) => {
            if (user) {
                UserModel.findOneAndUpdate({ username: username }, { $set: { "isadmin": true } }, { useFindAndModify: false, new: true })
                    .then(() => {
                        res.status(200).json({ msg: "user set as admin sucessfully" });
                    })
                    .catch((err => {
                        res.status(500).json({ errMsg: "fail to set that user as admin" });
                    }))
            } else {
                res.status(502).json({ errMsg: "user doesn't exist" });
            }
        }).catch((err) => {
            res.status(500).json(err);
        })
});


module.exports = usersRouter