// Toutes les constantes de politique d'emprunt en un seul endroit.
// Modifier ici pour changer la durée sans toucher à la logique métier.
export const LoanPolicy = Object.freeze({
    // Durée maximale d'un emprunt en millisecondes (7 jours)
    MAX_LOAN_DURATION_MS: 7 * 24 * 60 * 60 * 1000,

    // Seuil d'alerte préventive (5 jours) : l'étudiant est prévenu avant l'échéance
    WARNING_THRESHOLD_MS: 5 * 24 * 60 * 60 * 1000,

    // Fréquence de vérification de la tâche planifiée (toutes les heures)
    CHECK_INTERVAL_MS: 60 * 60 * 1000,
});