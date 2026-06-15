import bcrypt from 'bcryptjs';
import { sqlitePrisma, mongodbPrisma } from '../config/db.js';

async function main() {
    console.log("Début de l'ensemencement (Seeding) des bases de données...");

    // 1. Préparation des données communes
    const defaultPassword = "user123";
    const adminPassword = "admin123";
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
    const userHashedPassword = await bcrypt.hash(defaultPassword, 10);

    const adminData = {
        username: "admin",
        password: adminHashedPassword,
        role: "ADMIN"
    };

    const studentData = {
        username: "mola",
        password: userHashedPassword,
        role: "STUDENT",
        matricule: "25ENSPM0491"
    };

    const equipmentData = {
        name: "Routeur Cisco Catalyst 2960",
        category: "Réseau",
        status: "En stock",
        referenceCode: "REF-RP4-001"
    };

    // ==========================================
    // INJECTION DANS SQLITE (Base Relationnelle)
    // ==========================================
    console.log("Écriture dans SQLite...");
    
    // Nettoyage préalable pour éviter les conflits de doublons d'unicité (Facultatif)
    await sqlitePrisma.loan.deleteMany({});
    await sqlitePrisma.user.deleteMany({});
    await sqlitePrisma.equipment.deleteMany({});

    const sqliteAdmin = await sqlitePrisma.user.create({ data: adminData });
    const sqliteStudent = await sqlitePrisma.user.create({ data: studentData });
    const sqliteEquip = await sqlitePrisma.equipment.create({ data: equipmentData });

    console.log(`SQLite peuplé ! Admin ID: ${sqliteAdmin.id}, Étudiant ID: ${sqliteStudent.id}`);

    // ==========================================
    // INJECTION DANS MONGODB (Base NoSQL)
    // ==========================================
    console.log("Écriture dans MongoDB...");
    
    await mongodbPrisma.user.deleteMany({});
    await mongodbPrisma.equipment.deleteMany({});

    const mongoAdmin = await mongodbPrisma.user.create({ data: adminData });
    const mongoStudent = await mongodbPrisma.user.create({ data: studentData });
    const mongoEquip = await mongodbPrisma.equipment.create({ data: equipmentData });

    console.log(`MongoDB peuplé ! Admin ID (ObjectId): ${mongoAdmin.id}, Étudiant ID: ${mongoStudent.id}`);
}

main()
    .catch((e) => {
        console.error("Erreur critique lors du seeding :", e);
        process.exit(1);
    })
    .finally(async () => {
        // Déconnexion propre des sockets et descripteurs de fichiers
        await sqlitePrisma.$disconnect();
        await mongodbPrisma.$disconnect();
        console.log("Processus de seeding terminé avec succès.");
    });