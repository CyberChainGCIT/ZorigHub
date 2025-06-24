const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    photo: {
        type: String,
        required: [true, "Provide a photo to help people visualize"],
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
});

module.exports = mongoose.model('User', userSchema);
