import React, { useState } from 'react';
import type { CalendarEvent, Prospect } from '../types/types';
import { addEvent, generateId } from '../utils/storage';

interface PlanningProps {
    events: CalendarEvent[];
    prospects: Prospect[];
    onAddEvent: (event: CalendarEvent) => void;
}

const Planning: React.FC<PlanningProps> = ({ events, prospects, onAddEvent }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'rdv' as CalendarEvent['type'],
        prospectId: '',
    });

    // Jours du mois
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);

    const handleSubmit = () => {
        const event: CalendarEvent = {
            id: generateId(),
            prospectId: newEvent.prospectId || undefined,
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            time: newEvent.time,
            type: newEvent.type,
            color: newEvent.type === 'rdv' ? '#c8102e' : newEvent.type === 'rappel' ? '#f59e0b' : '#3b82f6',
        };
        addEvent(event);
        onAddEvent(event);
        setShowForm(false);
        setNewEvent({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            type: 'rdv',
            prospectId: '',
        });
    };

    const getEventsForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.date === dateStr);
    };

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Planning</h1>
                        <p className="text-gray-500">Gérez vos rendez-vous et rappels</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-[#c8102e] text-white rounded-lg hover:bg-[#a00d24] font-medium"
                    >
                        + Événement
                    </button>
                </div>

                {/* Navigation mois */}
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        ←
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800 w-48 text-center">
                        {monthNames[month]} {year}
                    </h2>
                    <button
                        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Calendrier */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    {/* Jours de la semaine */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Jours du mois */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} className="h-24" />;
                            }

                            const dayEvents = getEventsForDay(day);

                            return (
                                <div
                                    key={day}
                                    className={`h-24 p-1 rounded-lg border transition-all ${isToday(day)
                                        ? 'border-[#c8102e] bg-red-50'
                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-[#c8102e]' : 'text-gray-700'}`}>
                                        {day}
                                    </div>
                                    <div className="space-y-0.5 overflow-hidden">
                                        {dayEvents.slice(0, 3).map((event) => (
                                            <div
                                                key={event.id}
                                                className="text-xs px-1 py-0.5 rounded truncate text-white"
                                                style={{ backgroundColor: event.color }}
                                                title={`${event.time} - ${event.title}`}
                                            >
                                                {event.time} {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="text-xs text-gray-400">+{dayEvents.length - 3}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Événements à venir */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">📅 À venir</h3>
                    <div className="space-y-2">
                        {events
                            .filter(e => new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .slice(0, 5)
                            .map((event) => (
                                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: event.color }}
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">{event.title}</div>
                                        <div className="text-sm text-gray-500">{event.description}</div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Modal nouvel événement */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Nouvel événement</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                >
                                    <option value="rdv">📅 RDV</option>
                                    <option value="rappel">🔔 Rappel</option>
                                    <option value="deadline">⏰ Deadline</option>
                                    <option value="autre">📌 Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    placeholder="Ex: RDV client..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prospect (optionnel)</label>
                                <select
                                    value={newEvent.prospectId}
                                    onChange={(e) => setNewEvent({ ...newEvent, prospectId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                >
                                    <option value="">Aucun</option>
                                    {prospects.map(p => (
                                        <option key={p.id} value={p.id}>{p.companyName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                                    rows={2}
                                    placeholder="Notes..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-2 bg-[#c8102e] text-white rounded-lg font-medium hover:bg-[#a00d24]"
                            >
                                Créer
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planning;
