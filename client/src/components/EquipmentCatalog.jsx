// client/src/components/EquipmentCatalog.jsx
import { useState, useEffect, useContext, useMemo } from 'react';
import React from 'react';
import {
    Search, SlidersHorizontal, Monitor, Wifi, Server,
    HardDrive, Package, Loader2, X, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { AuthContext }      from '../context/AuthContext';
import { EquipmentStatus }  from '../config/constants';
import api                  from '../services/api';
import { Button }           from '@/components/ui/button';
import { Input }            from '@/components/ui/input';
import { Badge }            from '@/components/ui/badge';
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// Constantes de configuration
// ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    [EquipmentStatus.IN_STOCK]: {
        label:   'En stock',
        variant: 'available',
        icon:    CheckCircle2,
        dot:     'bg-emerald-500',
    },
    [EquipmentStatus.BORROWED]: {
        label:   'Emprunté',
        variant: 'borrowed',
        icon:    Clock,
        dot:     'bg-amber-400',
    },
    [EquipmentStatus.MAINTENANCE]: {
        label:   'Maintenance',
        variant: 'maintenance',
        icon:    AlertCircle,
        dot:     'bg-red-400',
    },
};

const FILTER_TABS = [
    { key: 'ALL',                         label: 'Tous' },
    { key: EquipmentStatus.IN_STOCK,      label: 'Disponibles' },
    { key: EquipmentStatus.BORROWED,      label: 'Empruntés' },
    { key: EquipmentStatus.MAINTENANCE,   label: 'Maintenance' },
];

// Icône déterminée selon la catégorie
function getCategoryIcon(category = '') {
    const cat = category.toLowerCase();
    if (cat.includes('réseau') || cat.includes('reseau') || cat.includes('switch') || cat.includes('routeur'))
        return Wifi;
    if (cat.includes('serveur') || cat.includes('server'))
        return Server;
    if (cat.includes('stockage') || cat.includes('disque'))
        return HardDrive;
    if (cat.includes('ordinateur') || cat.includes('pc') || cat.includes('laptop'))
        return Monitor;
    return Package;
}

// ─────────────────────────────────────────────────────────────
// Sous-composant : Skeleton de chargement
// ─────────────────────────────────────────────────────────────
function EquipmentSkeleton() {
    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden animate-pulse">
            <div className="h-28 bg-[var(--code-bg)]" />
            <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 rounded bg-[var(--border)]" />
                <div className="h-3 w-1/2 rounded bg-[var(--border)]" />
                <div className="h-3 w-1/3 rounded bg-[var(--border)]" />
                <div className="h-8 w-full rounded-md bg-[var(--border)] mt-4" />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Sous-composant : Formulaire de demande d'emprunt (inline)
// ─────────────────────────────────────────────────────────────
function LoanRequestForm({ equipment, user, onSuccess, onCancel }) {
    const [matricule, setMatricule] = useState('');
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/loans', {
                equipmentId: equipment.id || equipment._id,
                studentMatricule: user.matricule || matricule,
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la demande.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3 border-t border-[var(--border)] pt-3 animate-slide-up">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
            )}
            {/* Saisie matricule si non disponible en session */}
            {!user.matricule && (
                <Input
                    placeholder="Votre matricule (ex: 25ENSPM0001)"
                    value={matricule}
                    onChange={e => setMatricule(e.target.value)}
                    className="text-xs h-8"
                    required
                    disabled={loading}
                />
            )}
            <div className="flex gap-2">
                <Button
                    type="submit"
                    size="sm"
                    disabled={loading}
                    className="flex-1 text-xs"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    {loading ? 'Envoi…' : 'Confirmer la demande'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    disabled={loading}
                    className="text-xs px-2"
                >
                    <X className="w-3 h-3" />
                </Button>
            </div>
        </form>
    );
}

// ─────────────────────────────────────────────────────────────
// Sous-composant : Carte d'équipement
// ─────────────────────────────────────────────────────────────
const EquipmentCard = React.memo(function EquipmentCard({ equipment, user, onActionSuccess }) {
    const [showForm, setShowForm] = useState(false);
    const [success,  setSuccess]  = useState(false);

    const isAvailable = equipment.status === EquipmentStatus.IN_STOCK;
    const statusCfg   = STATUS_CONFIG[equipment.status] ?? STATUS_CONFIG[EquipmentStatus.MAINTENANCE];
    const CategoryIcon = getCategoryIcon(equipment.category);

    const handleSuccess = () => {
        setShowForm(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            if (onActionSuccess) onActionSuccess();
        }, 2500);
    };

    return (
        <Card
            className={cn(
                'group flex flex-col overflow-hidden transition-all duration-300',
                'hover:shadow-card-hover hover:-translate-y-0.5',
                !isAvailable && 'opacity-80'
            )}
        >
            {/* ── Bannière supérieure colorée ── */}
            <div className={cn(
                'relative h-24 flex items-center justify-center',
                isAvailable
                    ? 'bg-gradient-to-br from-[var(--accent-bg)] to-purple-50/50'
                    : 'bg-[var(--code-bg)]'
            )}>
                {/* Indicateur de statut (pastille) */}
                <span className={cn(
                    'absolute top-3 right-3 w-2.5 h-2.5 rounded-full',
                    statusCfg.dot
                )} />

                {/* Icône catégorie */}
                <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    'bg-white/70 shadow-sm border border-white/50',
                    'group-hover:scale-105 transition-transform duration-300'
                )}>
                    <CategoryIcon className={cn(
                        'w-6 h-6',
                        isAvailable ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                    )} />
                </div>
            </div>

            {/* ── Corps de la carte ── */}
            <CardContent className="flex flex-col flex-1 p-4">

                {/* Badge statut */}
                <div className="mb-3">
                    <Badge variant={statusCfg.variant} className="text-[10px] py-0.5">
                        <statusCfg.icon className="w-3 h-3" />
                        {statusCfg.label}
                    </Badge>
                </div>

                {/* Nom de l'équipement */}
                <h3 className="font-semibold text-sm text-[var(--text-h)] leading-tight mb-1
                               group-hover:text-[var(--accent)] transition-colors">
                    {equipment.name}
                </h3>

                {/* Catégorie */}
                <p className="text-xs text-[var(--text)] mb-2">{equipment.category}</p>

                {/* Code de référence */}
                <code className="text-[10px] font-mono bg-[var(--code-bg)] text-[var(--text)]
                                 px-2 py-0.5 rounded w-fit mb-auto">
                    {equipment.referenceCode}
                </code>

                {/* Retour succès */}
                {success && (
                    <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-xs animate-fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        Demande envoyée avec succès !
                    </div>
                )}

                {/* Formulaire inline */}
                {showForm && !success && (
                    <LoanRequestForm
                        equipment={equipment}
                        user={user}
                        onSuccess={handleSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                )}
            </CardContent>

            {/* ── Pied de carte : bouton ── */}
            {!showForm && !success && (
                <CardFooter className="p-4 pt-0">
                    <Button
                        size="sm"
                        variant={isAvailable ? 'default' : 'outline'}
                        disabled={!isAvailable}
                        onClick={() => setShowForm(true)}
                        className="w-full text-xs"
                    >
                        {isAvailable ? 'Demander l\'emprunt' : 'Indisponible'}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
});

// ─────────────────────────────────────────────────────────────
// Composant principal : EquipmentCatalog
// ─────────────────────────────────────────────────────────────
export default function EquipmentCatalog() {
    const { user } = useContext(AuthContext);

    const [equipments, setEquipments] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState('');
    const [search,     setSearch]     = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');

    /* ── Chargement initial ── */
    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/equipments');
            // getAllEquipments retourne { data: [], pagination: {} } depuis le refactor
            const list = response.data?.data ?? response.data ?? [];
            setEquipments(Array.isArray(list) ? list : []);
        } catch {
            setError('Impossible de charger le catalogue. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    /* ── Filtrage côté client ── */
    const filtered = useMemo(() => {
        return equipments
            .filter(e => activeFilter === 'ALL' || e.status === activeFilter)
            .filter(e => {
                const q = search.toLowerCase();
                return (
                    e.name?.toLowerCase().includes(q) ||
                    e.category?.toLowerCase().includes(q) ||
                    e.referenceCode?.toLowerCase().includes(q)
                );
            });
    }, [equipments, search, activeFilter]);

    /* ── Compteurs par statut ── */
    const counts = useMemo(() => ({
        ALL:                       equipments.length,
        [EquipmentStatus.IN_STOCK]:    equipments.filter(e => e.status === EquipmentStatus.IN_STOCK).length,
        [EquipmentStatus.BORROWED]:    equipments.filter(e => e.status === EquipmentStatus.BORROWED).length,
        [EquipmentStatus.MAINTENANCE]: equipments.filter(e => e.status === EquipmentStatus.MAINTENANCE).length,
    }), [equipments]);

    return (
        <section className="space-y-6 animate-fade-in">

            {/* ── En-tête ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-h)]">
                        Catalogue des équipements
                    </h2>
                    <p className="text-sm text-[var(--text)] mt-0.5">
                        {equipments.length} équipement{equipments.length > 1 ? 's' : ''} enregistré{equipments.length > 1 ? 's' : ''}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchInventory}
                    disabled={loading}
                    className="self-start sm:self-auto"
                >
                    {loading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <SlidersHorizontal className="w-4 h-4" />
                    }
                    Actualiser
                </Button>
            </div>

            {/* ── Barre de recherche ── */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-[var(--text)] pointer-events-none" />
                <Input
                    placeholder="Rechercher par nom, catégorie ou code…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-10 h-10"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-[var(--text)] hover:text-[var(--text-h)] transition-colors"
                        aria-label="Effacer la recherche"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ── Filtres par statut ── */}
            <div className="flex flex-wrap gap-2">
                {FILTER_TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                            'border transition-all duration-200',
                            activeFilter === key
                                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                                : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                        )}
                    >
                        {label}
                        <span className={cn(
                            'inline-flex items-center justify-center min-w-[18px] h-[18px]',
                            'rounded-full text-[10px] px-1',
                            activeFilter === key
                                ? 'bg-white/20 text-white'
                                : 'bg-[var(--code-bg)] text-[var(--text-h)]'
                        )}>
                            {counts[key] ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Erreur réseau ── */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* ── Grille de cartes ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <EquipmentSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                /* État vide */
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent-bg)] flex items-center
                                    justify-center">
                        <Package className="w-8 h-8 text-[var(--accent)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--text-h)]">
                        {search ? 'Aucun résultat trouvé' : 'Aucun équipement disponible'}
                    </h3>
                    <p className="text-sm text-[var(--text)] max-w-xs">
                        {search
                            ? `Aucun équipement ne correspond à « ${search} ».`
                            : 'Le catalogue est actuellement vide.'}
                    </p>
                    {search && (
                        <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                            Effacer la recherche
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(item => (
                        <EquipmentCard
                            key={item._id ?? item.id}
                            equipment={item}
                            user={user}
                            onActionSuccess={fetchInventory}
                        />
                    ))}
                </div>
            )}

            {/* ── Résumé résultats filtrés ── */}
            {!loading && filtered.length > 0 && (
                <p className="text-xs text-[var(--text)] text-center pb-2">
                    Affichage de <strong className="text-[var(--text-h)]">{filtered.length}</strong> équipement{filtered.length > 1 ? 's' : ''}
                    {search && <> pour la recherche « <em>{search}</em> »</>}
                </p>
            )}
        </section>
    );
}