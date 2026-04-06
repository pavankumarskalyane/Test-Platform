import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();

const app = express();

// Robust CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Test Platform API is running...');
});

// Catch-all 404 to output JSON instead of Render's default HTML
app.use((req, res, next) => {
    res.status(404).json({ message: 'API Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

// Ensure database array connects BEFORE starting the HTTP server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Critical Server Boot Error:", err);
    process.exit(1);
});
