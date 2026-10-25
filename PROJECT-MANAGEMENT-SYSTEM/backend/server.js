import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5174' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Project Management API is running.' }));
app.use('/api/tasks', taskRoutes);
app.use((_req, res) => res.status(404).json({ message: 'API route not found.' }));

const port = process.env.PORT || 5001;
connectDB().then(() => app.listen(port, () => console.log(`Server running at http://localhost:${port}`)));
