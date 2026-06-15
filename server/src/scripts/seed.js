import bcrypt from 'bcryptjs';
import './config/db.js';
import { Equipment, User } from './models/index.js';
import 'dotenv/config';

async function main() {
    console.log('Début de l\'ensemencement (Seeding) MongoDB...');

    const defaultPassword = 'user123';
    const adminPassword = 'admin123';
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
    const userHashedPassword = await bcrypt.hash(defaultPassword, 10);

    const adminData = {
        username: 'admin',
        password: adminHashedPassword,
        role: 'ADMIN',
        matricule: null,
    };

    const studentData = {
        username: 'mola',
        password: userHashedPassword,
        role: 'STUDENT',
        matricule: '25ENSPM0491',
    };

    const equipmentData = {
        name: 'Routeur Cisco Catalyst 2960',
        category: 'Réseau',
        status: 'En stock',
        referenceCode: 'CISCO-2960',
    };

    try {
        console.log('Nettoyage des collections MongoDB...');
        await User.deleteMany({});
        await Equipment.deleteMany({});

        const adminUser = await User.create(adminData);
        const studentUser = await User.create(studentData);
        const createdEquipment = await Equipment.create(equipmentData);

        console.log(`MongoDB peuplé ! Admin ID: ${adminUser._id}, Étudiant ID: ${studentUser._id}, Equip ID: ${createdEquipment._id}`);
    } catch (error) {
        console.error('Erreur critique lors du seeding :', error);
        process.exit(1);
    }

    console.log('Processus de seeding terminé avec succès.');
}

main();