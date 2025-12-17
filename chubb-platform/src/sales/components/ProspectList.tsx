import React, { useState } from 'react';
import type { Prospect } from '../types';
import { STATUS_COLORS, STATUS_LABELS, SECTOR_LABELS } from '../types';

interface ProspectListProps {
    prospects: Prospect[];
    onSelectProspect: (prospect: Prospect) => void;
    onNewProspect: () => void;
}

const ProspectList: React.FC<ProspectListProps> = ({ prospects, onSelectProspect, onNewProspect }) => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSector, setFilterSector] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'score' | 'value' | 'date'>('score');

    // Filtrage et tri
    let filtered = prospects.filter(p => {
        const matchSearch = p.companyName.toLowerCase().includes(search.toLowerCase()) ||
            p.contactName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || p.status === filterStatus;
        const matchSector = filterSector === 'all' || p.sector === filterSector;
        return matchSearch && matchStatus && matchSector;
    });

    // Tri
    filtered = filtered.sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score;
        if (sortBy === 'value') return b.potentialValue - a.potentialValue;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Prospects</h1>
                        <p className="text-gray-500">{prospects.length} prospects au total</p>
                    </div>
                    <button
                        onClick={onNewProspect}
                        className="px-4 py-2 bg-[#c8102e] text-white rounded-lg hover:bg-[#a00d24] transition-all font-medium"
                    >
                        + Nouveau
                    </button>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="🔍 Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c8102e]"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                        <option value="all">Tous les statuts</option>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <select
                        value={filterSector}
                        onChange={(e) => setFilterSector(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                        <option value="all">Tous les secteurs</option>
                        {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'score' | 'value' | 'date')}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                        <option value="score">Trier par score</option>
                        <option value="value">Trier par valeur</option>
                        <option value="date">Trier par date</option>
                    </select>
                </div>
            </div>

            {/* Liste */}
            <div className="flex-1 overflow-auto p-6">
                {filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-500">Aucun prospect trouvé</p>
                        <button
                            onClick={onNewProspect}
                            className="mt-4 px-6 py-2 bg-[#c8102e] text-white rounded-lg"
                        >
                            Créer un prospect
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((prospect) => (
                            <ProspectCard
                                key={prospect.id}
                                prospect={prospect}
                                onClick={() => onSelectProspect(prospect)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Carte prospect
const ProspectCard: React.FC<{
    prospect: Prospect;
    onClick: () => void;
}> = ({ prospect, onClick }) => {
    // Jauge de score
    const scoreColor = prospect.score >= 70 ? '#22c55e' : prospect.score >= 40 ? '#f59e0b' : '#ef4444';

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-[#c8102e]/30"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-bold text-gray-800">{prospect.companyName}</h3>
                    <p className="text-sm text-gray-500">{SECTOR_LABELS[prospect.sector]}</p>
                </div>
                <div
                    className="px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: STATUS_COLORS[prospect.status] }}
                >
                    {STATUS_LABELS[prospect.status]}
                </div>
            </div>

            {/* Contact */}
            <div className="text-sm text-gray-600 mb-3">
                <div>👤 {prospect.contactName}</div>
                <div className="text-xs text-gray-400">{prospect.contactRole}</div>
            </div>

            {/* Valeur et probabilité */}
            <div className="flex items-center justify-between mb-3 text-sm">
                <div>
                    <span className="text-gray-500">Valeur:</span>
                    <span className="font-bold text-gray-800 ml-1">{prospect.potentialValue.toLocaleString()}€</span>
                </div>
                <div>
                    <span className="text-gray-500">Proba:</span>
                    <span className="font-bold text-gray-800 ml-1">{prospect.probability}%</span>
                </div>
            </div>

            {/* Score */}
            <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Score</span>
                    <span className="font-bold" style={{ color: scoreColor }}>{prospect.score}/100</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all"
                        style={{
                            width: `${prospect.score}%`,
                            backgroundColor: scoreColor,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProspectList;
