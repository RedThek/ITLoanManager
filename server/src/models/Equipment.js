import mongoose from 'mongoose';

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
},
    { 
        toJSON: { 
            virtuals: true 
        } 
});

equipmentSchema.index({ status: 1 });
equipmentSchema.index({ category: 1 });

export const Equipment = mongoose.models.Equipment || model('Equipment', equipmentSchema);
