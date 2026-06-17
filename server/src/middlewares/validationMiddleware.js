import { body, validationResult } from 'express-validator';

export const validateLogin = [
    body('username').trim().notEmpty().escape(),
    body('password').notEmpty().isLength({ min: 6 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];

export const validateEquipment = [
    body('name').trim().notEmpty().escape(),
    body('category').trim().notEmpty().escape(),
    body('referenceCode').trim().notEmpty().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];