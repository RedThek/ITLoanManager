import "dotenv/config";
import { defineConfig } from "prisma/config";

// Configuration exclusive pour la base de données NoSQL
export default defineConfig({
  schema: "prisma/schema.mongodb.prisma",
  datasource: {
    // Liaison de l'URL réseau de MongoDB
    url: process.env.MONGODB_URL,
  },
});