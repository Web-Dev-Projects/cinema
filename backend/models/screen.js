const mongoose = require('mongoose');

module.exports = mongoose.model('Screen',
    new mongoose.Schema({
        sn: Number,
        rows: Number,
        columns: Number,
    }));
