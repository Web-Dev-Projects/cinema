const mongoose = require('mongoose');

module.exports = mongoose.model('Sids',
    new mongoose.Schema({
        sid: { type: Number, default: 1 }
    }));