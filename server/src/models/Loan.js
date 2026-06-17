import mongoose from 'mongoose';

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
    },
    dueDate:    {
        type: Date,
        default: null, // Calculé automatiquement lors du passage au statut 'Approuve'
    }
}, {
    toJSON: {
        virtuals: true
    }
});

loanSchema.index({ studentId: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ status: 1, requestDate: 1 }); // pour overdue queries
loanSchema.index({ equipmentId: 1 });

export const Loan = mongoose.models.Loan || model('Loan', loanSchema);
