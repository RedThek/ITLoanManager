import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const EquipmentRepository = {
    // Insertion en base de données via Prisma
    async create(equipmentData) {
        return await prisma.equipment.create({
            data: {
                name: equipmentData.name,
                category: equipmentData.category,
                referenceCode: equipmentData.referenceCode,
                status: equipmentData.status || "En stock" // Valeur par défaut conforme
            }
        });
    },

    async findByReference(referenceCode) {
        return await prisma.equipment.findUnique({
            where: { referenceCode }
        });
    }
};