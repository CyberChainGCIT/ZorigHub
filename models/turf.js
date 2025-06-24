const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["5-sided", "7-sided", "11-sided"],
        default: "11-sided",
    },
    location: {
        type: String,
        required: [true, "Please provide the location where the ground is"],
    },
    photo: {
        type: String,
        required: [true, "Provide a photo to help people visualize"],
    },
    pricePerHour: {
        type: Number,
        required: [true, "Please specify the price per hour"],
        min: [0, "Price must be a positive number"]
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            review: {
                type: String
            },
            ratedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    averageRating: {
        type: Number,
        min: [0, "Average rating cannot be negative"],
        max: [5, "Average rating cannot exceed 5"],
        default: 0
    }
}, {
    timestamps: true
});

// Recalculate averageRating on rating changes
turfSchema.methods.updateAverageRating = function () {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
    } else {
        const total = this.ratings.reduce((sum, r) => sum + r.score, 0);
        this.averageRating = parseFloat((total / this.ratings.length).toFixed(1));
    }
    return this.save();
};

module.exports = mongoose.model("Turf", turfSchema);
