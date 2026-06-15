import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const SQLITE_URL = process.env.SQLITE_URL || 'file:./sqlite_data.db';
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/gpmit';

function sqliteRun(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

function sqliteAll(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

async function ensureSqliteSchema(db) {
    // Create tables if missing (keeps schema compatible with Prisma models)
    await sqliteRun(db, `CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        matricule TEXT UNIQUE,
        createdAt TEXT DEFAULT (datetime('now'))
    )`);

    await sqliteRun(db, `CREATE TABLE IF NOT EXISTS Equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        status TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
    )`);

    await sqliteRun(db, `CREATE TABLE IF NOT EXISTS Loan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        equipmentId INTEGER,
        status TEXT,
        requestDate TEXT DEFAULT (datetime('now')),
        actionDate TEXT,
        FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE,
        FOREIGN KEY(equipmentId) REFERENCES Equipment(id) ON DELETE CASCADE
    )`);
}

async function main() {
    console.log('Début de l\'ensemencement (Seeding) des bases de données...');

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
    };

    // ---------- SQLite seeding ----------
    const sqlitePath = SQLITE_URL.startsWith('file:') ? SQLITE_URL.slice(5) : SQLITE_URL;
    const sqliteDriver = sqlite3.verbose();
    const db = new sqliteDriver.Database(sqlitePath);

    try {
        await ensureSqliteSchema(db);

        console.log('Nettoyage des tables SQLite...');
        await sqliteRun(db, 'DELETE FROM Loan');
        await sqliteRun(db, 'DELETE FROM User');
        await sqliteRun(db, 'DELETE FROM Equipment');

        const res1 = await sqliteRun(db, 'INSERT INTO User (username,password,role,matricule) VALUES (?,?,?,?)', [
            adminData.username,
            adminData.password,
            adminData.role,
            adminData.matricule,
        ]);

        const adminId = res1.lastID;

        const res2 = await sqliteRun(db, 'INSERT INTO User (username,password,role,matricule) VALUES (?,?,?,?)', [
            studentData.username,
            studentData.password,
            studentData.role,
            studentData.matricule,
        ]);
        const studentId = res2.lastID;

        const res3 = await sqliteRun(db, 'INSERT INTO Equipment (name,category,status) VALUES (?,?,?)', [
            equipmentData.name,
            equipmentData.category,
            equipmentData.status,
        ]);
        const equipId = res3.lastID;

        console.log(`SQLite peuplé ! Admin ID: ${adminId}, Étudiant ID: ${studentId}, Equip ID: ${equipId}`);
    } finally {
        db.close();
    }

    // ---------- MongoDB seeding ----------
    const mongoClient = new MongoClient(MONGODB_URL, { maxPoolSize: 10 });
    await mongoClient.connect();
    try {
        const mongoDbName = mongoClient.db().databaseName || new URL(MONGODB_URL).pathname.replace(/^\//, '') || 'test';
        const dbMongo = mongoClient.db();

        console.log('Nettoyage des collections MongoDB...');
        await dbMongo.collection('User').deleteMany({});
        await dbMongo.collection('Equipment').deleteMany({});

        const mongoAdmin = await dbMongo.collection('User').insertOne({
            username: adminData.username,
            password: adminData.password,
            role: adminData.role,
            createdAt: new Date(),
        });

        const mongoStudent = await dbMongo.collection('User').insertOne({
            username: studentData.username,
            password: studentData.password,
            role: studentData.role,
            matricule: studentData.matricule,
            createdAt: new Date(),
        });

        const mongoEquip = await dbMongo.collection('Equipment').insertOne({
            name: equipmentData.name,
            category: equipmentData.category,
            status: equipmentData.status,
            createdAt: new Date(),
        });

        console.log(`MongoDB peuplé ! Admin ID: ${mongoAdmin.insertedId}, Étudiant ID: ${mongoStudent.insertedId}`);
    } finally {
        await mongoClient.close();
    }

    console.log('Processus de seeding terminé avec succès.');
}

main().catch((e) => {
    console.error('Erreur critique lors du seeding :', e);
    process.exit(1);
});