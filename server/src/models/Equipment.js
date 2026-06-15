import mongoose from '../config/db.js';

const { Schema, model } = mongoose;

const equipmentSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    category: { 
        type: String, 
        required: true, 
        trim: true 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['En stock', 'Emprunte', 'Maintenance'], 
        default: 'En stock' 
    },
    referenceCode: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const Equipment = mongoose.models.Equipment || model('Equipment', equipmentSchema);``
