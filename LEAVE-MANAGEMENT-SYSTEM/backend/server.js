import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Leave Management API is running.' }));
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/admin', adminRoutes);
app.use((_req, res) => res.status(404).json({ message: 'API route not found.' }));

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`Server running at http://localhost:${port}`)));
