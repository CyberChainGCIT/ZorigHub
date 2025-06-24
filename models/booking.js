const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Booking must be associated with a user'],
        },
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Turf',
            required: [true, 'Booking must be associated with a turf'],
        },
        date: {
            type: Date,
            required: [true, 'Please specify the booking date'],
        },
        startTime: {
            type: String,
            required: [true, 'Please specify a start time (e.g. "15:00")'],
        },
        endTime: {
            type: String,
            required: [true, 'Please specify an end time (e.g. "16:00")'],
        },
        price: {
            type: Number,
            required: [true, 'Please specify the booking price'],
        },
        status: {
            type: String,
            enum: ['confirmed', 'completed', 'cancelled'],
            default: 'confirmed',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Booking', bookingSchema);