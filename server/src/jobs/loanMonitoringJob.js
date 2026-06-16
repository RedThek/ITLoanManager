import { LoanMonitoringService } from '../services/LoanMonitoringService.js';
import { LoanPolicy } from '../config/loanPolicy.js';

// Lance la vérification périodique des emprunts en retard.
// Appelé une seule fois au démarrage du serveur depuis app.js.
export function startLoanMonitoringJob() {
    console.log(
        `[LoanMonitoringJob] Démarrage — vérification toutes les ${LoanPolicy.CHECK_INTERVAL_MS / 3600000}h`
    );

    // Première exécution immédiate au démarrage (sans attendre le premier intervalle)
    runCheck();

    setInterval(runCheck, LoanPolicy.CHECK_INTERVAL_MS);
}

async function runCheck() {
    try {
        const result = await LoanMonitoringService.checkAndNotifyOverdueLoans();
        console.log(
            `[LoanMonitoringJob] Vérification terminée : ${result.checked} prêts actifs, ` +
            `${result.warningsCreated} alertes créées, ${result.remindersCreated} rappels créés.`
        );
    } catch (error) {
        console.error('[LoanMonitoringJob] Erreur lors de la vérification :', error.message);
        // On ne relance pas l'erreur : la tâche doit continuer malgré les erreurs
    }
}