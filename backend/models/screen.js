const mongoose = require('mongoose');

module.exports = mongoose.model('Screen',
    new mongoose.Schema({
        sn: { type: Number, unique: true, required: true, dropDups: true },
        rows: Number,
        columns: Number,
    }));
