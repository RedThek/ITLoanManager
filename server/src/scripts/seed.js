import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { Equipment, User } from '../models/index.js';


async function main() {
    await connectDB();
    console.log('Connexion établie, début du seeding...');

    const adminPassword = await bcrypt.hash('admin123', 12);
    const studentPassword = await bcrypt.hash('user123', 12);

    await User.deleteMany({});
    await Equipment.deleteMany({});

    const admin = await User.create(
        {   username: 'admin', 
            password: adminPassword, 
            role: 'ADMIN', 
            matricule: null 
        }
    );

    const student = await User.create(
        {   username: 'mola', 
            password: studentPassword, 
            role: 'STUDENT', 
            matricule: '25ENSPM0491' 
        }
    );

    const equip = await Equipment.create(
        { 
            name: 'Routeur Cisco Catalyst 2960', 
            category: 'Réseau', 
            status: 'En stock', 
            referenceCode: 'CISCO-2960' 
        }
    );

    console.log(
        `Admin: ${admin._id}, 
        Étudiant: ${student._id}, 
        Équipement: ${equip._id}`
    );
    
    await mongoose.connection.close();
}

main().catch((e) => { console.error(e); process.exit(1); });