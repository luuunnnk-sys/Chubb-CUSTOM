// Types pour le CRM Commercial Chubb

export interface Prospect {
    id: string;
    // Informations entreprise
    companyName: string;
    sector: 'tertiaire' | 'industrie' | 'commerce' | 'logistique' | 'sante' | 'education' | 'autre';
    employeeCount: string;
    annualRevenue: string;
    address: string;

    // Contact principal
    contactName: string;
    contactRole: string;
    contactEmail: string;
    contactPhone: string;

    // Qualification
    status: 'nouveau' | 'contact' | 'rdv' | 'proposition' | 'negociation' | 'gagne' | 'perdu';
    potentialValue: number;
    probability: number; // 0-100
    expectedDate: string; // Date de conclusion estimée

    // SONCAS
    soncas: {
        securite: number; // 0-10
        orgueil: number;
        nouveaute: number;
        confort: number;
        argent: number;
        sympathie: number;
    };

    // Projets client
    hasProjects: boolean;
    projectDescription: string;
    projectDeadline: string;

    // Métadonnées
    createdAt: string;
    updatedAt: string;
    score: number; // Score calculé automatiquement
}

export interface Action {
    id: string;
    prospectId: string;
    type: 'appel' | 'email' | 'rdv' | 'relance' | 'proposition' | 'note';
    title: string;
    description: string;
    date: string;
    completed: boolean;
    reminder?: string; // Date de rappel
}

export interface CalendarEvent {
    id: string;
    prospectId?: string;
    title: string;
    description: string;
    date: string;
    time: string;
    type: 'rdv' | 'rappel' | 'deadline' | 'autre';
    color: string;
}

// Données pour le dashboard
export interface DashboardStats {
    totalProspects: number;
    activeProspects: number;
    wonThisMonth: number;
    potentialRevenue: number;
    avgScore: number;
    upcomingActions: number;
}

// Couleurs par statut
export const STATUS_COLORS: Record<Prospect['status'], string> = {
    nouveau: '#3b82f6', // blue
    contact: '#8b5cf6', // violet
    rdv: '#f59e0b', // amber
    proposition: '#f97316', // orange
    negociation: '#ec4899', // pink
    gagne: '#22c55e', // green
    perdu: '#ef4444', // red
};

export const STATUS_LABELS: Record<Prospect['status'], string> = {
    nouveau: 'Nouveau',
    contact: 'En contact',
    rdv: 'RDV planifié',
    proposition: 'Proposition envoyée',
    negociation: 'En négociation',
    gagne: 'Gagné ✓',
    perdu: 'Perdu',
};

export const SECTOR_LABELS: Record<Prospect['sector'], string> = {
    tertiaire: 'Tertiaire',
    industrie: 'Industrie',
    commerce: 'Commerce',
    logistique: 'Logistique',
    sante: 'Santé',
    education: 'Éducation',
    autre: 'Autre',
};
