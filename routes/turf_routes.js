const express = require('express');
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Grab the Turf model from turfmasterDB
const Turf = mongoose.connection
    .useDb('turfmasterDB')
    .model('Turf', require('../models/turf').schema);

// GET all active turfs
router.get('/', async (req, res) => {
    try {
        const turfs = await Turf.find();
        res.json(turfs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add new turf (admin only)
router.post(
    '/',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        const { name, description, location, photo, pricePerHour } = req.body;
        try {
            const turf = new Turf({
                name,
                description,
                location,
                photo,
                pricePerHour,
                status: 'active',
            });
            await turf.save();
            res.status(201).json(turf);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// PUT update turf (admin only)
router.put(
    '/:id',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        const updates = (({ name, description, type, location, photo, pricePerHour, status }) => ({
            name,
            description,
            type,
            location,
            photo,
            pricePerHour,
            status,
        }))(req.body);

        try {
            const turf = await Turf.findByIdAndUpdate(req.params.id, updates, {
                new: true,
                runValidators: true,
            });
            if (!turf) return res.status(404).json({ error: 'Turf not found' });
            res.json(turf);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// DELETE turf (admin only)
router.delete(
    '/:id',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const result = await Turf.findByIdAndDelete(req.params.id);
            if (!result) return res.status(404).json({ error: 'Turf not found' });
            res.json({ message: 'Turf deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// POST submit a rating (user only)
router.post(
    '/:id/rate',
    authenticateToken,
    authorizeRole('user'),
    async (req, res) => {
        const { score, review } = req.body;
        if (typeof score !== 'number' || score < 1 || score > 5) {
            return res
                .status(400)
                .json({ error: 'Score must be a number between 1 and 5' });
        }

        try {
            const turf = await Turf.findById(req.params.id);
            if (!turf) return res.status(404).json({ error: 'Turf not found' });

            // Prevent double-rating by same user:
            turf.ratings = turf.ratings.filter(r => !r.user.equals(req.user.id));

            turf.ratings.push({
                user: req.user.id,
                score,
                review,
                ratedAt: Date.now(),
            });

            await turf.updateAverageRating();
            res.json({ averageRating: turf.averageRating, totalRatings: turf.ratings.length });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// GET all ratings for a turf
router.get('/:id/ratings', authenticateToken, async (req, res) => {
    try {
        const turf = await Turf.findById(req.params.id).populate({
            path: 'ratings.user',
            select: 'name photo',
        });
        if (!turf) return res.status(404).json({ error: 'Turf not found' });
        res.json(turf.ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;