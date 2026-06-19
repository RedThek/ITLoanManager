import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import compression from 'compression';
import helmet from 'helmet';
import { connectDB } from './config/db.js';


import authRoutes from './routes/authRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
//import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { startLoanMonitoringJob } from './jobs/loanMonitoringJob.js';


if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 4) {
    console.error('FATAL: JWT_SECRET manquant ou trop court (min 4 caractères).');
    process.exit(1);
}

const app = express();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

app.use(express.json());
app.use(
    cors({
            origin: (origin, callback) => {
                if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Non autorisé par CORS'));
                }
            },
            credentials: true,
        }
    )
);
app.use(compression());
app.use(helmet());

connectDB();

app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/loans', loanRoutes);
//app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.get('/api/diagnostic', async (req, res) => {
    return res.json({ status: 'OK', database: 'MongoDB' });
});

app.listen(PORT, () => {
    console.log(`Serveur actif et à l'écoute sur : http://localhost:${PORT}`);
    console.log(`Testez de connectivité via GET http://localhost:${PORT}/api/diagnostic`);
});

startLoanMonitoringJob();