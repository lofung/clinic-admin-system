const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    doctor: {
        type: String,
        trim: true,
        required: [true, "Must have doctor's name"]
    },
    clinic: {
        type: String,
        trim: true,
        required: [true, "Must have doctor's name"]
    }, 
    date: {
        type: String,
        required: [true, "Must have a date"]
    },
    am: {
        type: Boolean,
        Required: [true, "Must have time"]
    },
    weight: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EntrySchema', EntrySchema);
