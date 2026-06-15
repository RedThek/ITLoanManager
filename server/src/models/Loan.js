import mongoose from '../config/db.js';

const { Schema, model } = mongoose;

const loanSchema = new Schema({
    studentId: { 
        type: String,
        required: true 
    },
    equipmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Equipment',
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['En attente', 'Approuve', 'Refuse', 'Termine'], 
        default: 'En attente' 
    },
    requestDate: { 
        type: Date, 
        default: Date.now 
    },
    actionDate: { 
        type: Date 
    }
});

export const Loan = mongoose.models.Loan || model('Loan', loanSchema);
