// Importation des clients générés dans leurs dossiers respectifs
import { PrismaClient as SQLiteClient } from '../generated/sqlite/index.js';
import { PrismaClient as MongoDBClient } from '../generated/mongodb/index.js';

// Initialisation unique (Singleton Pattern)
const sqlitePrisma = new SQLiteClient({
    datasources: { db: { url: process.env.SQLITE_URL } }
});

const mongodbPrisma = new MongoDBClient({
    datasources: { db: { url: process.env.MONGODB_URL } }
});

// Exportation uniforme pour le reste de l'application
export { sqlitePrisma, mongodbPrisma };