import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { sqlitePrisma, mongodbPrisma } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/auth', authRoutes);
app.use('/api', equipmentRoutes);
app.use('/api', loanRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.get('/api/diagnostic', async (req, res) => {
    // ... inchangé
});

app.listen(PORT, () => {
    console.log(`Serveur actif et à l'écoute sur : http://localhost:${PORT}`);
    console.log(`Testez la connectivité via GET http://localhost:${PORT}/api/diagnostic`);
});