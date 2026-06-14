import { EquipmentRepository } from '../repositories/equipmentRepository.js';

export const EquipmentService = {
    async registerEquipment(equipmentData) {
        // Logique métier : Empêcher les doublons de code de référence
        const existing = await EquipmentRepository.findByReference(equipmentData.referenceCode);
        if (existing) {
            throw new Error("Un équipement avec ce code de référence existe déjà.");
        }
        
        // Application des règles métiers ou formatage additionnel si nécessaire
        return await EquipmentRepository.create(equipmentData);
    }
};