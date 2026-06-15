import { EquipmentService } from '../services/equipmentService.js';

export const createEquipment = async (req, res) => {
    try {
        // Extraction des données du corps de la requête HTTP
        const { name, category, referenceCode } = req.body;

        // Validation basique des champs requis [cite: 26, 27, 29]
        if (!name || !category || !referenceCode) {
            return res.status(400).json({ error: "Tous les champs (name, category, referenceCode) sont requis." });
        }

        const newEquipment = await EquipmentService.registerEquipment({ name, category, referenceCode });
        return res.status(201).json(newEquipment);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllEquipments = async (req, res) => {
    try {
        const equipments = await EquipmentService.getAllEquipments();
        return res.json(equipments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
