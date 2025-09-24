const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes')); // <-- This line is new

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// A small change to force a new commit
// Final push to fix the login page