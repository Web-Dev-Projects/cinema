const mongoose = require('mongoose');

module.exports = mongoose.model('Movie',
    new mongoose.Schema({
        name: String,
        genre: String,
        screen: Number,
        length: Number,
        screenings: {
            type: [{
                screengingtime: Date,
                reservations: {
                    type: [{ row: Number, column: Number }],
                    default: []
                },
            }],
            default: []
        }
    }));
