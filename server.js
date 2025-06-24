// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user_routes');
const turfRoutes = require('./routes/turf_routes');
const viewRoutes = require('./routes/view_routes');
const bookingRoutes = require('./routes/booking_routes');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mount your routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/', viewRoutes);

// export the app for testing
module.exports = app;

// if run directly, connect DB and start listening
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error("❌ Missing MONGO_URI env var");
        process.exit(1);
    }

    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            mongoose.connection.useDb('turfmasterDB');
            console.log('Using turfmasterDB database');
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        })
        .catch(err => {
            console.error('Failed to connect to MongoDB:', err);
            process.exit(1);
        });
}
