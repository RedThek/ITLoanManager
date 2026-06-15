import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import './config/db.js';

import authRoutes from './routes/authRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.get('/api/diagnostic', async (req, res) => {
    return res.json({ status: 'OK', database: 'MongoDB' });
});

app.listen(PORT, () => {
    console.log(`Serveur actif et à l'écoute sur : http://localhost:${PORT}`);
    console.log(`Testez de connectivité via GET http://localhost:${PORT}/api/diagnostic`);
});