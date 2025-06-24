const express = require('express');
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Grab the Booking model from turfmasterDB
const theBookingDB = mongoose.connection.useDb('turfmasterDB');
const User = theBookingDB.model('User', require('../models/user').schema);
const Booking = theBookingDB.model('Booking', require('../models/booking').schema);
const Turf = theBookingDB.model('Turf', require('../models/turf').schema);

// GET all bookings (admin can view all, users see their own)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'admin') {
            bookings = await Booking.find().populate('user', 'name email').populate('turf', 'name location');
        } else {
            bookings = await Booking.find({ user: req.user.id }).populate('turf', 'name location');
        }
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single booking by ID (owner or admin)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('turf', 'name location pricePerHour');
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a booking (user only)
router.post('/', authenticateToken, authorizeRole('user'), async (req, res) => {
    const { turf: turfId, date, startTime, endTime, price } = req.body;

    try {
        // 1. Check turf exists
        const turf = await Turf.findById(turfId);
        if (!turf) return res.status(404).json({ error: 'Turf not found' });

        // 2. Parse the new booking times
        const bookingDate = new Date(date);
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);

        const newStart = new Date(bookingDate);
        newStart.setHours(startH, startM, 0, 0);

        const newEnd = new Date(bookingDate);
        newEnd.setHours(endH, endM, 0, 0);

        if (newEnd <= newStart) {
            return res.status(400).json({ error: 'endTime must be after startTime' });
        }

        // 3. Build a day-range without mutating bookingDate
        const dayStart = new Date(bookingDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(bookingDate);
        dayEnd.setHours(23, 59, 59, 999);

        // 4. Find existing pending/confirmed bookings in that window
        const existing = await Booking.find({
            turf: turfId,
            status: { $in: ['pending', 'confirmed'] },
            date: { $gte: dayStart, $lte: dayEnd }
        });

        // 5. Overlap check
        for (let b of existing) {
            const [bSH, bSM] = b.startTime.split(':').map(Number);
            const [bEH, bEM] = b.endTime.split(':').map(Number);

            const existingStart = new Date(bookingDate);
            existingStart.setHours(bSH, bSM, 0, 0);
            const existingEnd = new Date(bookingDate);
            existingEnd.setHours(bEH, bEM, 0, 0);

            if (newStart < existingEnd && newEnd > existingStart) {
                return res
                    .status(409)
                    .json({ error: 'This time slot is already booked.' });
            }
        }

        // 6. No conflicts: create booking
        const booking = await Booking.create({
            user: req.user.id,
            turf: turfId,
            date,
            startTime,
            endTime,
            price,
            status: 'confirmed',
        });

        res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// PUT update booking status or details (admin or owner)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // only admin or owner can update
        const isOwner = booking.user.toString() === req.user.id;
        if (req.user.role !== 'admin' && !isOwner) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { date, startTime, endTime, status } = req.body;

        // allow any user (owner or admin) to change the date/time
        if (date) booking.date = date;
        if (startTime) booking.startTime = startTime;
        if (endTime) booking.endTime = endTime;

        // status: admin can set anything; owner can only cancel
        if (status) {
            if (req.user.role === 'admin') {
                booking.status = status;
            } else if (isOwner && status === 'cancelled') {
                booking.status = 'cancelled';
            } else {
                return res
                    .status(403)
                    .json({ error: 'You are not allowed to set that status' });
            }
        }
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// DELETE cancel booking (owner or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;