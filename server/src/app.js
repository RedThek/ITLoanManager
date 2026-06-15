import express from 'express';
import 'dotenv/config';
import { sqlitePrisma, mongodbPrisma } from './config/db.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.get('/api/diagnostic', async (req, res) => {
    const diagnosticReport = { sqlite: {}, mongodb: {} };

    try {
        const sqliteUsers = await sqlitePrisma.user.findMany();
        const sqliteEquipments = await sqlitePrisma.equipment.findMany();
        diagnosticReport.sqlite = { status: "OK", utilisateurs: sqliteUsers.length, equipements: sqliteEquipments.length };
    } catch (error) {
        diagnosticReport.sqlite = { status: "ERREUR", message: error.message };
    }

    try {
        const mongoUsers = await mongodbPrisma.user.findMany();
        const mongoEquipments = await mongodbPrisma.equipment.findMany();
        diagnosticReport.mongodb = { status: "OK", documents_users: mongoUsers.length, documents_equipements: mongoEquipments.length };
    } catch (error) {
        diagnosticReport.mongodb = { status: "ERREUR", message: error.message };
    }

    res.json({
        service: "API Gestionnaire de Prêt IT",
        timestamp: new Date(),
        bases_de_donnees: diagnosticReport
    });
});

app.listen(PORT, () => {
    console.log(`Serveur actif et à l'écoute sur : http://localhost:${PORT}`);
    console.log(`Testez la connectivité via GET http://localhost:${PORT}/api/diagnostic`);
});