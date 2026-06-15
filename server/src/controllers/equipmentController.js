import Equipment from '../models/Equipment.js';

// POST /api/equipments -> Ajout de matériel (Réservé Admin)
export const createEquipment = async (req, res) => {
    try {
        const newItem = await Equipment.create(req.body);
        return res.status(201).json(newItem);
    } catch (error) {
        return res.status(400).json({ error: "Données invalides : " + error.message });
    }
};

// GET /api/equipments -> Liste complète du matériel
export const getAllEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find();
        return res.json(equipments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
