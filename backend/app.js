const express = require('express');
const usersRouter = require('./routes/users')
const moviesRouter = require('./routes/movies')
const cors = require('./middlewares/cors')
const db = require('./db')
const app = express();

db.connect("cinema");

app.use(express.json());
app.use(cors)
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening at port 3000 !!!");
});

module.exports = app;