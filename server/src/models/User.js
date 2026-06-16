import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['STUDENT', 'ADMIN'] },
    matricule: { type: String, trim: true, unique: true, sparse: true, default: null },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: {
        virtuals: true
    }
});

export const User = mongoose.models.User || model('User', userSchema);
