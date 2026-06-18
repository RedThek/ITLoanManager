import { useState, useEffect, useCallback, useContext } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import {
    Package, ClipboardList, Users, AlertTriangle,
    LogOut, RefreshCw, CheckCircle2, Clock,
    XCircle, Bell, Loader2, ChevronRight,
    LayoutDashboard, WrenchIcon, Activity,
    TrendingUp, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { cn } from '@/lib/utils.js';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
//import AdminHeader from '../components/AdminHeader.jsx';
//import AdminAlertBanner from './AdminAlertBanner.jsx';
//import AdminTabNav from '../components/AdminTabNav.jsx';
//import LoansTable from '../components/LoansTable.jsx';
import AddEquipmentForm from '../components/AddEquipmentForm.jsx';
//import AdminLoanRow from '../components/AdminLoanRow.jsx';
import AdminInventoryManager from '../components/AdminInventoryManager.jsx';
import AddStudentForm from '../components/AddStudentForm.jsx';
import OverdueLoansTable from '../components/OverdueLoansTable.jsx';
import { LoanStatus, EquipmentStatus } from '../config/constants.js';

/* ─── Config des statuts de prêt ──────────────────────────────────────────── */
const LOAN_STATUS_CFG = {
    [LoanStatus.PENDING]:  { label: 'En attente',  icon: Clock,         cls: 'text-amber-600 bg-amber-50 border-amber-200' },
    [LoanStatus.APPROVED]: { label: 'Approuvé',    icon: CheckCircle2,  cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    [LoanStatus.REJECTED]: { label: 'Refusé',      icon: XCircle,       cls: 'text-red-600 bg-red-50 border-red-200' },
    [LoanStatus.FINISHED]: { label: 'Terminé',     icon: ShieldCheck,   cls: 'text-slate-600 bg-slate-50 border-slate-200' },
};


/* ─── Carte de statistique ────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, accent = false, loading = false, pulse = false }) {
    return (
        <Card className={cn(
            'relative overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
            accent && 'border-[var(--accent-border)]'
        )}>
            {accent && (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-bg)] to-transparent pointer-events-none" />
            )}
            <CardContent className="p-5 relative">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-2">{label}</p>
                        {loading
                            ? <div className="h-9 w-14 bg-[var(--border)] rounded-lg animate-pulse" />
                            : (
                                <p className={cn(
                                    'text-3xl font-bold leading-none tabular-nums',
                                    accent ? 'text-[var(--accent)]' : 'text-[var(--text-h)]'
                                )}>
                                    {value ?? '—'}
                                </p>
                            )
                        }
                        {sub && !loading && (
                            <p className="text-xs text-[var(--text)] mt-1.5 leading-snug">{sub}</p>
                        )}
                    </div>
                    <div className={cn(
                        'relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center',
                        accent ? 'bg-[var(--accent)]' : 'bg-[var(--code-bg)]'
                    )}>
                        <Icon className={cn('w-5 h-5', accent ? 'text-white' : 'text-[var(--accent)]')} />
                        {pulse && !loading && (value ?? 0) > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

 
/* ─── Barre de progression du parc ───────────────────────────────────────── */
function EquipmentBar({ label, value, total, colorClass, textClass }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-h)] font-medium">{label}</span>
                <span className={cn('font-bold tabular-nums', textClass)}>
                    {value}
                    <span className="text-[var(--text)] font-normal ml-1 text-xs">({pct}%)</span>
                </span>
            </div>
            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                    className={cn('h-full rounded-full transition-all duration-700', colorClass)}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}


/* ─── Ligne d'un prêt dans le tableau admin ───────────────────────────────── */
function LoanRow({ loan, onRefresh }) {
    const [busy, setBusy] = useState(false);
    const cfg = LOAN_STATUS_CFG[loan.status] ?? LOAN_STATUS_CFG[LoanStatus.PENDING];
    const StatusIcon = cfg.icon;
 
    const act = async (status) => {
        setBusy(true);
        try {
            await api.patch(`/loans/${loan._id}/status`, { status });
            toast.success(`Statut mis à jour : ${LOAN_STATUS_CFG[status]?.label}`);
            onRefresh();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Erreur lors de la mise à jour.');
        } finally {
            setBusy(false);
        }
    };
 
    return (
        <tr className="border-b border-[var(--border)] hover:bg-[var(--code-bg)] transition-colors group">
            <td className="px-4 py-3">
                <code className="text-xs bg-[var(--accent-bg)] text-[var(--accent)] px-2 py-0.5 rounded border border-[var(--accent-border)]">
                    {loan.studentId}
                </code>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm font-medium text-[var(--text-h)]">
                    {loan.equipmentId?.name ?? <em className="text-[var(--text)] font-normal">Inconnu</em>}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-[var(--text)] tabular-nums">
                {new Date(loan.requestDate).toLocaleDateString('fr-FR')}
            </td>
            <td className="px-4 py-3">
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.cls)}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {loan.status === LoanStatus.PENDING && (
                        <>
                            <Button size="sm" variant="success" disabled={busy} onClick={() => act(LoanStatus.APPROVED)}
                                className="h-7 text-xs gap-1.5">
                                {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Approuver
                            </Button>
                            <Button size="sm" variant="destructive" disabled={busy} onClick={() => act(LoanStatus.REJECTED)}
                                className="h-7 text-xs gap-1.5">
                                <XCircle className="w-3 h-3" />
                                Refuser
                            </Button>
                        </>
                    )}
                    {loan.status === LoanStatus.APPROVED && (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => act(LoanStatus.FINISHED)}
                            className="h-7 text-xs gap-1.5">
                            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                            Déclarer rendu
                        </Button>
                    )}
                    {[LoanStatus.REJECTED, LoanStatus.FINISHED].includes(loan.status) && (
                        <span className="text-xs text-[var(--text)] italic">Aucune action</span>
                    )}
                </div>
            </td>
        </tr>
    );
}


/* ─── Panneau de gestion des prêts ───────────────────────────────────────── */
function LoansPanel() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
 
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/loans');
            setLoans(res.data);
        } catch {
            toast.error('Impossible de charger les demandes.');
        } finally {
            setLoading(false);
        }
    }, []);
 
    useEffect(() => { fetch(); }, [fetch]);
 
    const counts = {
        ALL: loans.length,
        [LoanStatus.PENDING]:  loans.filter(l => l.status === LoanStatus.PENDING).length,
        [LoanStatus.APPROVED]: loans.filter(l => l.status === LoanStatus.APPROVED).length,
        [LoanStatus.REJECTED]: loans.filter(l => l.status === LoanStatus.REJECTED).length,
        [LoanStatus.FINISHED]: loans.filter(l => l.status === LoanStatus.FINISHED).length,
    };
    const filtered = loans.filter(l => filter === 'ALL' || l.status === filter);
 
    const FILTERS = [
        { key: 'ALL',                 label: 'Toutes' },
        { key: LoanStatus.PENDING,    label: 'En attente' },
        { key: LoanStatus.APPROVED,   label: 'Approuvées' },
        { key: LoanStatus.REJECTED,   label: 'Refusées' },
        { key: LoanStatus.FINISHED,   label: 'Terminées' },
    ];
 
    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-[var(--text-h)]">Demandes d'emprunt</h2>
                    <p className="text-sm text-[var(--text)]">{loans.length} demande{loans.length > 1 ? 's' : ''} au total</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetch} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Actualiser
                </Button>
            </div>
 
            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
                {FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200',
                            filter === key
                                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                                : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                        )}
                    >
                        {label}
                        <span className={cn(
                            'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] px-1',
                            filter === key ? 'bg-white/20 text-white' : 'bg-[var(--code-bg)] text-[var(--text-h)]'
                        )}>
                            {counts[key] ?? 0}
                        </span>
                    </button>
                ))}
            </div>
 
            {/* Tableau */}
            <Card>
                <div className="overflow-x-auto rounded-xl">
                    {loading ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <Loader2 className="w-7 h-7 animate-spin text-[var(--accent)]" />
                            <p className="text-sm text-[var(--text)]">Chargement des demandes…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--code-bg)] flex items-center justify-center">
                                <ClipboardList className="w-7 h-7 text-[var(--text)]" />
                            </div>
                            <p className="text-sm font-medium text-[var(--text-h)]">Aucune demande</p>
                            <p className="text-xs text-[var(--text)]">Aucun prêt ne correspond au filtre sélectionné.</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--code-bg)]">
                                    {['Matricule', 'Équipement', 'Date', 'Statut', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text)]">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(loan => (
                                    <LoanRow key={loan._id} loan={loan} onRefresh={fetch} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
}


/* ─── Composant principal ─────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
    const { user, logoutUser } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
 
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const [equipRes, pendingRes, overdueRes] = await Promise.allSettled([
                api.get('/equipments?limit=50'),
                api.get('/loans/pending-count'),
                api.get('/admin/loans/overdue'),
            ]);
 
            const equipList = equipRes.status === 'fulfilled'
                ? (equipRes.value.data?.data ?? equipRes.value.data ?? [])
                : [];
            const total      = equipRes.status === 'fulfilled'
                ? (equipRes.value.data?.pagination?.total ?? equipList.length)
                : 0;
            const pending    = pendingRes.status === 'fulfilled' ? pendingRes.value.data.pendingCount : 0;
            const overdueArr = overdueRes.status === 'fulfilled' ? overdueRes.value.data : [];
 
            setStats({
                total,
                available:   equipList.filter(e => e.status === EquipmentStatus.IN_STOCK).length,
                borrowed:    equipList.filter(e => e.status === EquipmentStatus.BORROWED).length,
                maintenance: equipList.filter(e => e.status === EquipmentStatus.MAINTENANCE).length,
                pending,
                overdue: Array.isArray(overdueArr) ? overdueArr.length : 0,
            });
        } catch {
            toast.error('Impossible de charger les statistiques.');
        } finally {
            setStatsLoading(false);
        }
    }, []);
 
    useEffect(() => { fetchStats(); }, [fetchStats]);
 
    const TABS = [
        { value: 'overview',   label: 'Vue d\'ensemble', icon: LayoutDashboard },
        { value: 'catalog',    label: 'Catalogue',       icon: Package },
        { value: 'loans',      label: 'Demandes',        icon: ClipboardList, badge: stats?.pending },
        { value: 'students',   label: 'Étudiants',       icon: Users },
        { value: 'inventory',  label: 'Inventaire',      icon: WrenchIcon },
        { value: 'overdue',    label: 'Retards',         icon: AlertTriangle, danger: true, badge: stats?.overdue },
    ];
 
    return (
        <div className="min-h-screen bg-[var(--bg)]">
 
            {/* ════════════════════════ HEADER ════════════════════════ */}
            <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
 
                        {/* Identité */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-700 flex items-center justify-center shadow-sm">
                                <span className="text-white font-black text-sm tracking-tight">E</span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="font-bold text-[var(--text-h)] leading-none text-sm">ENSPM</p>
                                <p className="text-[10px] text-[var(--text)] uppercase tracking-widest mt-0.5">Gestion des Prêts IT</p>
                            </div>
                        </div>
 
                        {/* Alertes + Utilisateur */}
                        <div className="flex items-center gap-3">
                            {/* Badge alerte demandes en attente */}
                            {(stats?.pending ?? 0) > 0 && (
                                <button
                                    onClick={() => setActiveTab('loans')}
                                    className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
                                >
                                    <Bell className="w-3.5 h-3.5" />
                                    {stats.pending} en attente
                                </button>
                            )}
 
                            {/* Info utilisateur */}
                            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-[var(--border)]">
                                <div className="w-8 h-8 rounded-full bg-[var(--accent-bg)] border border-[var(--accent-border)] flex items-center justify-center">
                                    <span className="text-[var(--accent)] text-xs font-bold uppercase">
                                        {user?.username?.[0] ?? 'A'}
                                    </span>
                                </div>
                                <div className="leading-tight">
                                    <p className="text-sm font-semibold text-[var(--text-h)]">{user?.username}</p>
                                    <p className="text-[10px] text-[var(--text)] uppercase tracking-wide">Admin</p>
                                </div>
                            </div>
 
                            <Button variant="outline" size="sm" onClick={logoutUser} className="text-xs h-8 gap-1.5">
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
 
            {/* ════════════════════════ CONTENU ════════════════════════ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
 
                {/* Titre de page */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">Panneau de contrôle</p>
                        <h1 className="text-2xl font-bold text-[var(--text-h)] leading-tight">Tableau de bord</h1>
                        <p className="text-sm text-[var(--text)] mt-1">
                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchStats} disabled={statsLoading} className="self-start sm:self-auto">
                        {statsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Actualiser les données
                    </Button>
                </div>
 
                {/* ── Grille de statistiques ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Package}
                        label="Total équipements"
                        value={stats?.total}
                        sub={`${stats?.available ?? '—'} disponibles en ce moment`}
                        loading={statsLoading}
                        accent
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Disponibles"
                        value={stats?.available}
                        sub={`${stats?.maintenance ?? '—'} en maintenance`}
                        loading={statsLoading}
                    />
                    <StatCard
                        icon={Activity}
                        label="Empruntés"
                        value={stats?.borrowed}
                        sub="Prêts actuellement actifs"
                        loading={statsLoading}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Demandes en attente"
                        value={stats?.pending}
                        sub={`${stats?.overdue ?? '—'} dossier${(stats?.overdue ?? 0) > 1 ? 's' : ''} en retard`}
                        loading={statsLoading}
                        pulse
                    />
                </div>
 
                {/* ── Onglets ── */}
                <RadixTabs.Root value={activeTab} onValueChange={setActiveTab}>
 
                    {/* Barre d'onglets */}
                    <div className="border-b border-[var(--border)]">
                        <RadixTabs.List className="flex -mb-px overflow-x-auto gap-0 scrollbar-none">
                            {TABS.map(({ value, label, icon: Icon, badge, danger }) => (
                                <RadixTabs.Trigger
                                    key={value}
                                    value={value}
                                    className={cn(
                                        'group relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer',
                                        'border-transparent text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--code-bg)]',
                                        danger
                                            ? 'hover:text-red-500 data-[state=active]:border-red-500 data-[state=active]:text-red-500'
                                            : 'data-[state=active]:border-[var(--accent)] data-[state=active]:text-[var(--accent)]'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                    {badge != null && badge > 0 && (
                                        <span className={cn(
                                            'inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold text-white',
                                            danger ? 'bg-red-500' : 'bg-amber-500'
                                        )}>
                                            {badge > 99 ? '99+' : badge}
                                        </span>
                                    )}
                                </RadixTabs.Trigger>
                            ))}
                        </RadixTabs.List>
                    </div>
 
                    {/* ────────── Onglet : Vue d'ensemble ────────── */}
                    <RadixTabs.Content value="overview" className="pt-6 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
                            {/* Actions rapides */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base">Actions rapides</CardTitle>
                                    <CardDescription>Naviguez vers les tâches courantes</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-0">
                                    {[
                                        {
                                            label: 'Traiter les demandes en attente',
                                            desc:  `${stats?.pending ?? 0} demande${(stats?.pending ?? 0) > 1 ? 's' : ''} à examiner`,
                                            tab:   'loans',
                                            icon:  ClipboardList,
                                            count: stats?.pending,
                                        },
                                        {
                                            label: 'Ajouter un équipement au catalogue',
                                            desc:  'Enregistrer un nouveau matériel',
                                            tab:   'catalog',
                                            icon:  Package,
                                        },
                                        {
                                            label: 'Créer un compte étudiant',
                                            desc:  'Ouvrir un accès à un nouvel étudiant',
                                            tab:   'students',
                                            icon:  Users,
                                        },
                                        {
                                            label: 'Consulter les retards',
                                            desc:  `${stats?.overdue ?? 0} emprunt${(stats?.overdue ?? 0) > 1 ? 's' : ''} dépassé${(stats?.overdue ?? 0) > 1 ? 's' : ''}`,
                                            tab:   'overdue',
                                            icon:  AlertTriangle,
                                            danger: true,
                                            count: stats?.overdue,
                                        },
                                    ].map(({ label, desc, tab, icon: Icon, count, danger }) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={cn(
                                                'w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left group',
                                                danger
                                                    ? 'border-[var(--border)] hover:border-red-300 hover:bg-red-50/50'
                                                    : 'border-[var(--border)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)]'
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                                                    danger
                                                        ? 'bg-red-50 group-hover:bg-red-100'
                                                        : 'bg-[var(--code-bg)] group-hover:bg-[var(--accent-bg)]'
                                                )}>
                                                    <Icon className={cn('w-4 h-4', danger ? 'text-red-500' : 'text-[var(--accent)]')} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--text-h)]">{label}</p>
                                                    <p className="text-xs text-[var(--text)] mt-0.5">{desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {count != null && count > 0 && (
                                                    <span className={cn(
                                                        'text-xs font-bold px-2 py-0.5 rounded-full',
                                                        danger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                                                    )}>
                                                        {count}
                                                    </span>
                                                )}
                                                <ChevronRight className="w-4 h-4 text-[var(--text)] group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>
 
                            {/* Répartition du parc */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base">Parc matériel</CardTitle>
                                            <CardDescription>Répartition par statut</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--text)]">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            {stats?.total ?? 0} équipements
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-0">
                                    {statsLoading ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="space-y-1.5">
                                                    <div className="h-4 w-32 bg-[var(--border)] rounded animate-pulse" />
                                                    <div className="h-2 bg-[var(--border)] rounded-full animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : stats ? (
                                        <>
                                            <EquipmentBar label="En stock"       value={stats.available}   total={stats.total} colorClass="bg-emerald-500" textClass="text-emerald-600" />
                                            <EquipmentBar label="Empruntés"      value={stats.borrowed}    total={stats.total} colorClass="bg-[var(--accent)]"  textClass="text-[var(--accent)]" />
                                            <EquipmentBar label="En maintenance" value={stats.maintenance} total={stats.total} colorClass="bg-red-400"     textClass="text-red-500" />
                                        </>
                                    ) : (
                                        <p className="text-sm text-[var(--text)] text-center py-8">Données indisponibles</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </RadixTabs.Content>
 
                    {/* ────────── Onglet : Catalogue ────────── */}
                    <RadixTabs.Content value="catalog" className="pt-6 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <AddEquipmentForm onEquipmentAdded={() => { fetchStats(); toast.success('Équipement ajouté au catalogue.'); }} />
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Gérer l'inventaire existant</CardTitle>
                                    <CardDescription>Modifiez ou supprimez les équipements enregistrés.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" onClick={() => setActiveTab('inventory')} className="gap-2">
                                        <WrenchIcon className="w-4 h-4" />
                                        Accéder à l'inventaire complet
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </RadixTabs.Content>
 
                    {/* ────────── Onglet : Demandes ────────── */}
                    <RadixTabs.Content value="loans" className="pt-6 animate-fade-in">
                        <LoansPanel />
                    </RadixTabs.Content>
 
                    {/* ────────── Onglet : Étudiants ────────── */}
                    <RadixTabs.Content value="students" className="pt-6 animate-fade-in">
                        <div className="max-w-lg">
                            <AddStudentForm onStudentAdded={() => toast.success('Compte étudiant créé avec succès.')} />
                        </div>
                    </RadixTabs.Content>
 
                    {/* ────────── Onglet : Inventaire ────────── */}
                    <RadixTabs.Content value="inventory" className="pt-6 animate-fade-in">
                        <AdminInventoryManager />
                    </RadixTabs.Content>
 
                    {/* ────────── Onglet : Retards ────────── */}
                    <RadixTabs.Content value="overdue" className="pt-6 animate-fade-in">
                        <OverdueLoansTable />
                    </RadixTabs.Content>
 
                </RadixTabs.Root>
            </main>
        </div>
    );
}
