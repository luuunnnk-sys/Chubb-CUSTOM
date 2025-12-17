import React, { useState } from 'react';
import type { Prospect, Action } from '../types';
import { STATUS_COLORS, STATUS_LABELS, SECTOR_LABELS } from '../types';
import { addAction, generateId } from '../storage';

interface ProspectDetailProps {
    prospect: Prospect;
    actions: Action[];
    onBack: () => void;
    onUpdate: (updates: Partial<Prospect>) => void;
    onDelete: () => void;
    onAddAction: (action: Action) => void;
}

const ProspectDetail: React.FC<ProspectDetailProps> = ({
    prospect,
    actions,
    onBack,
    onUpdate,
    onDelete,
    onAddAction,
}) => {
    const [activeTab, setActiveTab] = useState<'info' | 'soncas' | 'actions' | 'notes'>('info');
    const [newNote, setNewNote] = useState('');

    const scoreColor = prospect.score >= 70 ? '#22c55e' : prospect.score >= 40 ? '#f59e0b' : '#ef4444';

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const action: Action = {
            id: generateId(),
            prospectId: prospect.id,
            type: 'note',
            title: 'Note',
            description: newNote,
            date: new Date().toISOString(),
            completed: true,
        };
        addAction(action);
        onAddAction(action);
        setNewNote('');
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                        ← Retour
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">{prospect.companyName}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span
                                className="px-2 py-1 rounded text-xs font-medium text-white"
                                style={{ backgroundColor: STATUS_COLORS[prospect.status] }}
                            >
                                {STATUS_LABELS[prospect.status]}
                            </span>
                            <span className="text-sm text-gray-500">{SECTOR_LABELS[prospect.sector]}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold" style={{ color: scoreColor }}>{prospect.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                    </div>
                    <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Supprimer">
                        🗑️
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mt-4 border-b -mb-4">
                    {(['info', 'soncas', 'actions', 'notes'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-medium transition-all ${activeTab === tab
                                ? 'text-[#c8102e] border-b-2 border-[#c8102e]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'info' && '📋 Infos'}
                            {tab === 'soncas' && '🎯 SONCAS'}
                            {tab === 'actions' && '📝 Actions'}
                            {tab === 'notes' && '💬 Journal'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {activeTab === 'info' && <InfoTab prospect={prospect} onUpdate={onUpdate} />}
                {activeTab === 'soncas' && <SoncasTab prospect={prospect} onUpdate={onUpdate} />}
                {activeTab === 'actions' && <ActionsTab prospect={prospect} actions={actions} onAddAction={onAddAction} />}
                {activeTab === 'notes' && (
                    <div className="max-w-2xl">
                        <h2 className="text-lg font-semibold mb-4">Journal de bord</h2>
                        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Ajouter une note..."
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c8102e] resize-none"
                                rows={3}
                            />
                            <button onClick={handleAddNote} className="mt-2 px-4 py-2 bg-[#c8102e] text-white rounded-lg hover:bg-[#a00d24]">
                                Ajouter
                            </button>
                        </div>
                        <div className="space-y-3">
                            {actions
                                .filter(a => a.type === 'note')
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((action) => (
                                    <div key={action.id} className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="text-xs text-gray-400 mb-2">
                                            {new Date(action.date).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                            })}
                                        </div>
                                        <p className="text-gray-700">{action.description}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InfoTab: React.FC<{ prospect: Prospect; onUpdate: (updates: Partial<Prospect>) => void }> = ({ prospect, onUpdate }) => (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">🏢 Entreprise</h3>
            <div className="space-y-3">
                <Field label="Nom" value={prospect.companyName} />
                <Field label="Secteur" value={SECTOR_LABELS[prospect.sector]} />
                <Field label="Effectif" value={prospect.employeeCount} />
                <Field label="CA annuel" value={prospect.annualRevenue} />
                <Field label="Adresse" value={prospect.address} />
            </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">👤 Contact principal</h3>
            <div className="space-y-3">
                <Field label="Nom" value={prospect.contactName} />
                <Field label="Fonction" value={prospect.contactRole} />
                <Field label="Email" value={prospect.contactEmail} />
                <Field label="Téléphone" value={prospect.contactPhone} />
            </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">💼 Opportunité</h3>
            <div className="space-y-3">
                <div>
                    <label className="text-xs text-gray-500">Statut</label>
                    <select value={prospect.status} onChange={(e) => onUpdate({ status: e.target.value as Prospect['status'] })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg">
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500">Valeur potentielle (€)</label>
                    <input type="number" value={prospect.potentialValue} onChange={(e) => onUpdate({ potentialValue: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                    <label className="text-xs text-gray-500">Probabilité (%)</label>
                    <input type="range" min="0" max="100" value={prospect.probability} onChange={(e) => onUpdate({ probability: Number(e.target.value) })} className="w-full mt-1" />
                    <div className="text-right text-sm font-medium">{prospect.probability}%</div>
                </div>
            </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">📅 Projets client</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <input type="checkbox" checked={prospect.hasProjects} onChange={(e) => onUpdate({ hasProjects: e.target.checked })} className="w-4 h-4" />
                    <span>Le client a des projets en cours</span>
                </div>
            </div>
        </div>
    </div>
);

const SoncasTab: React.FC<{ prospect: Prospect; onUpdate: (updates: Partial<Prospect>) => void }> = ({ prospect, onUpdate }) => {
    const soncasItems = [
        { key: 'securite' as const, label: 'Sécurité', icon: '🛡️', desc: 'Besoin de protection, conformité' },
        { key: 'orgueil' as const, label: 'Orgueil', icon: '👑', desc: 'Image, prestige, reconnaissance' },
        { key: 'nouveaute' as const, label: 'Nouveauté', icon: '✨', desc: 'Innovation, modernisation' },
        { key: 'confort' as const, label: 'Confort', icon: '🛋️', desc: 'Facilité, simplicité, maintenance' },
        { key: 'argent' as const, label: 'Argent', icon: '💰', desc: 'Budget, ROI, économies' },
        { key: 'sympathie' as const, label: 'Sympathie', icon: '🤝', desc: 'Relation, confiance, affinité' },
    ];
    const handleChange = (key: keyof typeof prospect.soncas, value: number) => {
        onUpdate({ soncas: { ...prospect.soncas, [key]: value } });
    };
    return (
        <div className="max-w-2xl">
            <h2 className="text-lg font-semibold mb-2">Analyse SONCAS</h2>
            <p className="text-gray-500 text-sm mb-6">Évaluez les motivations d'achat du prospect sur chaque dimension</p>
            <div className="space-y-4">
                {soncasItems.map(({ key, label, icon, desc }) => (
                    <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{icon}</span>
                            <div>
                                <div className="font-medium">{label}</div>
                                <div className="text-xs text-gray-400">{desc}</div>
                            </div>
                            <div className="ml-auto text-xl font-bold text-[#c8102e]">{prospect.soncas[key]}/10</div>
                        </div>
                        <input type="range" min="0" max="10" value={prospect.soncas[key]} onChange={(e) => handleChange(key, Number(e.target.value))} className="w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActionsTab: React.FC<{ prospect: Prospect; actions: Action[]; onAddAction: (action: Action) => void }> = ({ prospect, actions, onAddAction }) => {
    const [showForm, setShowForm] = useState(false);
    const [newAction, setNewAction] = useState({ type: 'appel' as Action['type'], title: '', description: '', date: new Date().toISOString().split('T')[0] });
    const handleSubmit = () => {
        const action: Action = {
            id: generateId(), prospectId: prospect.id, type: newAction.type,
            title: newAction.title || `${newAction.type} - ${prospect.companyName}`,
            description: newAction.description, date: newAction.date, completed: false,
        };
        addAction(action);
        onAddAction(action);
        setShowForm(false);
        setNewAction({ type: 'appel', title: '', description: '', date: new Date().toISOString().split('T')[0] });
    };
    const actionTypes = [
        { value: 'appel', label: '📞 Appel' }, { value: 'email', label: '📧 Email' }, { value: 'rdv', label: '📅 RDV' },
        { value: 'relance', label: '🔔 Relance' }, { value: 'proposition', label: '📄 Proposition' },
    ];
    return (
        <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Actions commerciales</h2>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#c8102e] text-white rounded-lg hover:bg-[#a00d24]">+ Action</button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <select value={newAction.type} onChange={(e) => setNewAction({ ...newAction, type: e.target.value as Action['type'] })} className="px-3 py-2 border border-gray-200 rounded-lg">
                            {actionTypes.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
                        </select>
                        <input type="date" value={newAction.date} onChange={(e) => setNewAction({ ...newAction, date: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg" />
                    </div>
                    <input type="text" placeholder="Titre (optionnel)" value={newAction.title} onChange={(e) => setNewAction({ ...newAction, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3" />
                    <textarea placeholder="Description..." value={newAction.description} onChange={(e) => setNewAction({ ...newAction, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none" rows={2} />
                    <div className="flex gap-2 mt-3">
                        <button onClick={handleSubmit} className="px-4 py-2 bg-[#c8102e] text-white rounded-lg">Créer</button>
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Annuler</button>
                    </div>
                </div>
            )}
            <div className="space-y-3">
                {actions.filter(a => a.type !== 'note').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((action) => (
                    <div key={action.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className="text-2xl">
                            {action.type === 'appel' && '📞'}{action.type === 'email' && '📧'}{action.type === 'rdv' && '📅'}
                            {action.type === 'relance' && '🔔'}{action.type === 'proposition' && '📄'}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-sm text-gray-500">{action.description}</div>
                        </div>
                        <div className="text-sm text-gray-400">{new Date(action.date).toLocaleDateString('fr-FR')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-gray-800">{value || '-'}</div>
    </div>
);

export default ProspectDetail;
