import { Equipment } from '../models/index.js';

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
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);
        const skip  = (page - 1) * limit;

        const [equipments, total] = await Promise.all(
            [
                Equipment.find().lean().skip(skip).limit(limit).sort(
                    { 
                        createdAt: -1 
                    }
                ),
                Equipment.countDocuments(),
            ]
        );
        return res.json(
            {
                data: equipments,
                pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
            }
        );
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) return res.status(404).json({ error: 'Équipement introuvable.' });
        return res.json(equipment);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
