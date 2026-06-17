import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10,                   // 10 tentatives max
        message: { 
            error: 'Trop de tentatives. Réessayez dans 15 minutes.' 
        },
        standardHeaders: true,
        legacyHeaders: false,
    }
);