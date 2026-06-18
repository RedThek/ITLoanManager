// client/src/pages/LoginPage.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Loader2, BookOpen, Shield, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Button }               from '@/components/ui/button';
import { Input }                from '@/components/ui/input';
import { Label }                from '@/components/ui/label';
import { Card, CardContent }    from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ─────────────────────────────────────────────────────────────────────────────
// Données statiques — fonctionnalités affichées sur le panneau gauche
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
    {
        icon: BookOpen,
        title: 'Catalogue en temps réel',
        desc: 'Consultez la disponibilité de chaque équipement instantanément.',
    },
    {
        icon: Shield,
        title: 'Accès sécurisé par rôle',
        desc: 'Espace étudiant et espace administrateur cloisonnés avec JWT.',
    },
    {
        icon: Bell,
        title: 'Notifications automatiques',
        desc: 'Alertes d\'échéance et de retard envoyées en temps réel.',
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
    const { loginUser } = useContext(AuthContext);
    const navigate      = useNavigate();

    const [username,  setUsername]  = useState('');
    const [password,  setPassword]  = useState('');
    const [showPwd,   setShowPwd]   = useState(false);
    const [error,     setError]     = useState('');
    const [loading,   setLoading]   = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const user = await loginUser(username.trim(), password);
            navigate(user.role === 'ADMIN' ? '/admin' : '/student');
        } catch (err) {
            setError(err.response?.data?.error || 'Identifiants incorrects. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        /* ── Fond plein écran ── */
        <div className="min-h-screen flex items-stretch bg-[var(--bg)]">

            {/* ═══════════════════════════════════════════════════
                PANNEAU GAUCHE — Branding (caché sur mobile)
            ═══════════════════════════════════════════════════ */}
            <aside className="hidden lg:flex lg:w-[46%] flex-col justify-between
                              bg-gradient-to-br from-[#1a0730] via-[#2d0d5a] to-[#450f8a]
                              p-12 text-white relative overflow-hidden">

                {/* Cercles décoratifs */}
                <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px]
                                rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute bottom-[-120px] left-[-60px] w-[400px] h-[400px]
                                rounded-full bg-[var(--accent)]/10 pointer-events-none" />

                {/* Logo + nom */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center
                                        justify-center shadow-lg shadow-purple-900/50">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight">ENSPM</span>
                    </div>
                    <p className="text-white/50 text-xs uppercase tracking-widest">
                        Laboratoire Informatique
                    </p>
                </div>

                {/* Titre central */}
                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl font-bold leading-tight">
                        Gestion des<br />
                        <span className="text-[#c084fc]">Prêts Matériel</span>
                    </h1>
                    <p className="text-white/70 text-base leading-relaxed max-w-sm">
                        Numérisez et automatisez l'emprunt du matériel IT de votre laboratoire.
                    </p>

                    {/* Fonctionnalités */}
                    <ul className="space-y-4 mt-6">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <li key={title} className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/10 flex items-center
                                                justify-center shrink-0">
                                    <Icon className="w-4 h-4 text-[#c084fc]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{title}</p>
                                    <p className="text-xs text-white/55 mt-0.5">{desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <p className="relative z-10 text-white/30 text-xs">
                    © {new Date().getFullYear()} ENSPM — Tous droits réservés
                </p>
            </aside>

            {/* ═══════════════════════════════════════════════════
                PANNEAU DROIT — Formulaire
            ═══════════════════════════════════════════════════ */}
            <main className="flex-1 flex items-center justify-center
                             px-6 py-12 bg-[var(--bg)]">

                <div className="w-full max-w-[420px] animate-fade-in">

                    {/* En-tête mobile (logo visible uniquement sur petits écrans) */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                            <span className="text-white font-bold">E</span>
                        </div>
                        <span className="font-semibold text-[var(--text-h)]">ENSPM — Labo IT</span>
                    </div>

                    {/* Titre du formulaire */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[var(--text-h)]">
                            Connexion
                        </h2>
                        <p className="text-sm text-[var(--text)] mt-1">
                            Entrez vos identifiants pour accéder à votre espace.
                        </p>
                    </div>

                    {/* Carte formulaire */}
                    <Card className="border-[var(--border)] shadow-card">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} noValidate className="space-y-5">

                                {/* Alerte erreur */}
                                {error && (
                                    <Alert variant="destructive" className="animate-fade-in">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Champ : Nom d'utilisateur */}
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nom d'utilisateur</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2
                                                         w-4 h-4 text-[var(--text)] pointer-events-none" />
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Entrez votre identifiant"
                                            autoComplete="username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            disabled={loading}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Champ : Mot de passe */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2
                                                         w-4 h-4 text-[var(--text)] pointer-events-none" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPwd ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            disabled={loading}
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        {/* Bouton afficher/masquer */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(v => !v)}
                                            disabled={loading}
                                            aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                            className="absolute right-3 top-1/2 -translate-y-1/2
                                                       text-[var(--text)] hover:text-[var(--accent)]
                                                       transition-colors disabled:opacity-50"
                                        >
                                            {showPwd
                                                ? <EyeOff className="w-4 h-4" />
                                                : <Eye    className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                </div>

                                {/* Bouton de soumission */}
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={loading}
                                    className="w-full mt-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Connexion en cours…
                                        </>
                                    ) : (
                                        'Se connecter'
                                    )}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>

                    {/* Note de sécurité */}
                    <p className="mt-6 text-center text-xs text-[var(--text)]">
                        Accès réservé au personnel autorisé de l'ENSPM.
                        <br />
                        En cas de problème, contactez l'administrateur.
                    </p>
                </div>
            </main>
        </div>
    );
}