// Gestion du stockage local pour Sales CRM

import type { Prospect, Action, CalendarEvent } from './types';

const PROSPECTS_KEY = 'chubb_sales_prospects';
const ACTIONS_KEY = 'chubb_sales_actions';
const EVENTS_KEY = 'chubb_sales_events';

// Prospects
export function getProspects(): Prospect[] {
    const data = localStorage.getItem(PROSPECTS_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveProspects(prospects: Prospect[]): void {
    localStorage.setItem(PROSPECTS_KEY, JSON.stringify(prospects));
}

export function addProspect(prospect: Prospect): void {
    const prospects = getProspects();
    prospects.push(prospect);
    saveProspects(prospects);
}

export function updateProspect(id: string, updates: Partial<Prospect>): void {
    const prospects = getProspects();
    const index = prospects.findIndex(p => p.id === id);
    if (index !== -1) {
        prospects[index] = { ...prospects[index], ...updates, updatedAt: new Date().toISOString() };
        saveProspects(prospects);
    }
}

export function deleteProspect(id: string): void {
    const prospects = getProspects().filter(p => p.id !== id);
    saveProspects(prospects);
    // Supprimer aussi les actions liées
    const actions = getActions().filter(a => a.prospectId !== id);
    saveActions(actions);
}

// Actions
export function getActions(): Action[] {
    const data = localStorage.getItem(ACTIONS_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveActions(actions: Action[]): void {
    localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
}

export function addAction(action: Action): void {
    const actions = getActions();
    actions.push(action);
    saveActions(actions);
}

export function updateAction(id: string, updates: Partial<Action>): void {
    const actions = getActions();
    const index = actions.findIndex(a => a.id === id);
    if (index !== -1) {
        actions[index] = { ...actions[index], ...updates };
        saveActions(actions);
    }
}

export function deleteAction(id: string): void {
    const actions = getActions().filter(a => a.id !== id);
    saveActions(actions);
}

// Events
export function getEvents(): CalendarEvent[] {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveEvents(events: CalendarEvent[]): void {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function addEvent(event: CalendarEvent): void {
    const events = getEvents();
    events.push(event);
    saveEvents(events);
}

export function deleteEvent(id: string): void {
    const events = getEvents().filter(e => e.id !== id);
    saveEvents(events);
}

// Calcul du score prospect
export function calculateScore(prospect: Prospect): number {
    let score = 0;

    // Score basé sur la valeur potentielle (max 20 points)
    if (prospect.potentialValue > 100000) score += 20;
    else if (prospect.potentialValue > 50000) score += 15;
    else if (prospect.potentialValue > 20000) score += 10;
    else if (prospect.potentialValue > 5000) score += 5;

    // Score basé sur la probabilité (max 30 points)
    score += Math.round(prospect.probability * 0.3);

    // Score SONCAS (max 30 points)
    const soncasAvg = (
        prospect.soncas.securite +
        prospect.soncas.orgueil +
        prospect.soncas.nouveaute +
        prospect.soncas.confort +
        prospect.soncas.argent +
        prospect.soncas.sympathie
    ) / 6;
    score += Math.round(soncasAvg * 3);

    // Bonus si projet en cours (10 points)
    if (prospect.hasProjects) score += 10;

    // Bonus selon le statut (max 10 points)
    const statusPoints: Record<Prospect['status'], number> = {
        nouveau: 2,
        contact: 4,
        rdv: 6,
        proposition: 8,
        negociation: 9,
        gagne: 10,
        perdu: 0,
    };
    score += statusPoints[prospect.status];

    return Math.min(100, score);
}

// Générer un ID unique
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
