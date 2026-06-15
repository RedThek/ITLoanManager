import mongoose from '../config/db.js';

export const EquipmentRepository = {
    // Insertion en base de données via mongoose
    async create(equipmentData) {
        return await mongoose.equipment.create({
            data: {
                name: equipmentData.name,
                category: equipmentData.category,
                referenceCode: equipmentData.referenceCode,
                status: equipmentData.status || "En stock" // Valeur par défaut conforme
            }
        });
    },

    async findByReference(referenceCode) {
        return await mongoose.equipment.findOne({
            referenceCode
        });
    }
};