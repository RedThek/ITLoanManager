// Charger les variables d'environnement avant d'initialiser Prisma
import 'dotenv/config';

// Force Prisma client to use the binary engine in this Node.js environment.
// Some generated clients may default to the "client" (WASM) engine, which
// requires an adapter. Setting this env var before importing the generated
// Prisma client ensures the runtime picks the binary engine instead.
process.env.PRISMA_CLIENT_ENGINE_TYPE = process.env.PRISMA_CLIENT_ENGINE_TYPE || 'binary';

// Import des clients générés uniquement après l'initialisation des variables
// d'environnement pour garantir que Prisma choisit bien l'engine binaire.
const sqliteModule = await import('../generated/sqlite/index.js');
const mongodbModule = await import('../generated/mongodb/index.js');

const SQLiteClient = sqliteModule.PrismaClient ?? sqliteModule.default?.PrismaClient ?? sqliteModule.default;
const MongoDBClient = mongodbModule.PrismaClient ?? mongodbModule.default?.PrismaClient ?? mongodbModule.default;

// Initialisation unique (Singleton Pattern)
// Prisma v7 requires an explicit options object at construction time.
const sqlitePrisma = new SQLiteClient({});
const mongodbPrisma = new MongoDBClient({});

console.log("Connecteurs Prisma initialisés pour SQLite et MongoDB.");

// Exportation uniforme pour le reste de l'application
export { sqlitePrisma, mongodbPrisma };