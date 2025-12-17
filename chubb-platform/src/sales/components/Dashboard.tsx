import React from 'react';
import type { Prospect, Action, DashboardStats } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../types';

interface DashboardProps {
    prospects: Prospect[];
    actions: Action[];
    onSelectProspect: (prospect: Prospect) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ prospects, actions, onSelectProspect }) => {
    // Calculs statistiques
    const stats: DashboardStats = {
        totalProspects: prospects.length,
        activeProspects: prospects.filter(p => !['gagne', 'perdu'].includes(p.status)).length,
        wonThisMonth: prospects.filter(p => {
            const won = p.status === 'gagne';
            const thisMonth = new Date(p.updatedAt).getMonth() === new Date().getMonth();
            return won && thisMonth;
        }).length,
        potentialRevenue: prospects
            .filter(p => !['gagne', 'perdu'].includes(p.status))
            .reduce((sum, p) => sum + (p.potentialValue * p.probability / 100), 0),
        avgScore: prospects.length > 0
            ? Math.round(prospects.reduce((sum, p) => sum + p.score, 0) / prospects.length)
            : 0,
        upcomingActions: actions.filter(a => !a.completed && new Date(a.date) >= new Date()).length,
    };

    // Top prospects par score
    const topProspects = [...prospects]
        .filter(p => !['gagne', 'perdu'].includes(p.status))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    // Prospects par statut pour le pipeline
    const pipeline = ['nouveau', 'contact', 'rdv', 'proposition', 'negociation'] as const;

    return (
        <div className="h-full overflow-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
                <p className="text-gray-500">Vue d'ensemble de votre activité commerciale</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <StatCard label="Prospects" value={stats.totalProspects} icon="👥" color="bg-blue-500" />
                <StatCard label="En cours" value={stats.activeProspects} icon="🔄" color="bg-purple-500" />
                <StatCard label="Gagnés ce mois" value={stats.wonThisMonth} icon="🏆" color="bg-green-500" />
                <StatCard label="CA potentiel" value={`${Math.round(stats.potentialRevenue / 1000)}k€`} icon="💰" color="bg-amber-500" />
                <StatCard label="Score moyen" value={`${stats.avgScore}/100`} icon="⭐" color="bg-pink-500" />
                <StatCard label="Actions à faire" value={stats.upcomingActions} icon="📋" color="bg-red-500" />
            </div>

            {/* Pipeline visuel */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pipeline Commercial</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {pipeline.map((status) => {
                        const count = prospects.filter(p => p.status === status).length;
                        const value = prospects
                            .filter(p => p.status === status)
                            .reduce((sum, p) => sum + p.potentialValue, 0);
                        return (
                            <div
                                key={status}
                                className="flex-1 min-w-[140px] p-4 rounded-lg text-center"
                                style={{ backgroundColor: `${STATUS_COLORS[status]}15` }}
                            >
                                <div
                                    className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: STATUS_COLORS[status] }}
                                >
                                    {count}
                                </div>
                                <div className="font-medium text-gray-800 text-sm">{STATUS_LABELS[status]}</div>
                                <div className="text-xs text-gray-500 mt-1">{Math.round(value / 1000)}k€</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top prospects */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">🔥 Top Prospects</h2>
                {topProspects.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Aucun prospect actif</p>
                ) : (
                    <div className="space-y-3">
                        {topProspects.map((prospect, index) => (
                            <div
                                key={prospect.id}
                                onClick={() => onSelectProspect(prospect)}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-800">{prospect.companyName}</div>
                                    <div className="text-xs text-gray-500">{prospect.contactName}</div>
                                </div>
                                <div
                                    className="px-2 py-1 rounded text-xs font-medium text-white"
                                    style={{ backgroundColor: STATUS_COLORS[prospect.status] }}
                                >
                                    {STATUS_LABELS[prospect.status]}
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800">{prospect.score}</div>
                                    <div className="text-xs text-gray-500">score</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Composant StatCard
const StatCard: React.FC<{
    label: string;
    value: string | number;
    icon: string;
    color: string;
}> = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
            {icon}
        </div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
    </div>
);

export default Dashboard;
