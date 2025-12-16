import React, { useState } from 'react';
import type { Prospect } from '../types/types';
import { SECTOR_LABELS } from '../types/types';

interface NewProspectModalProps {
    onClose: () => void;
    onSave: (prospect: Omit<Prospect, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => void;
}

const NewProspectModal: React.FC<NewProspectModalProps> = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        // Entreprise
        companyName: '',
        sector: 'tertiaire' as Prospect['sector'],
        employeeCount: '',
        annualRevenue: '',
        address: '',
        // Contact
        contactName: '',
        contactRole: '',
        contactEmail: '',
        contactPhone: '',
        // Opportunité
        status: 'nouveau' as Prospect['status'],
        potentialValue: 0,
        probability: 50,
        expectedDate: '',
        // Projets
        hasProjects: false,
        projectDescription: '',
        projectDeadline: '',
        // SONCAS (défaut)
        soncas: {
            securite: 5,
            orgueil: 5,
            nouveaute: 5,
            confort: 5,
            argent: 5,
            sympathie: 5,
        },
    });

    const handleSubmit = () => {
        if (!form.companyName.trim()) {
            alert('Le nom de l\'entreprise est obligatoire');
            return;
        }
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
                    <h2 className="text-xl font-bold text-white">Nouveau Prospect</h2>
                    <p className="text-gray-300 text-sm">Étape {step} sur 3</p>
                </div>

                {/* Progress */}
                <div className="flex">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`flex-1 h-1 ${s <= step ? 'bg-[#c8102e]' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 mb-4">🏢 Informations entreprise</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom de l'entreprise *
                                </label>
                                <input
                                    type="text"
                                    value={form.companyName}
                                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c8102e]"
                                    placeholder="Ex: ACME Corp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
                                <select
                                    value={form.sector}
                                    onChange={(e) => setForm({ ...form, sector: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                >
                                    {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Effectif</label>
                                    <input
                                        type="text"
                                        value={form.employeeCount}
                                        onChange={(e) => setForm({ ...form, employeeCount: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                        placeholder="Ex: 50-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CA annuel</label>
                                    <input
                                        type="text"
                                        value={form.annualRevenue}
                                        onChange={(e) => setForm({ ...form, annualRevenue: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                        placeholder="Ex: 5M€"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                    placeholder="Adresse complète"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 mb-4">👤 Contact principal</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    value={form.contactName}
                                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                    placeholder="Ex: Jean Dupont"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
                                <input
                                    type="text"
                                    value={form.contactRole}
                                    onChange={(e) => setForm({ ...form, contactRole: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                    placeholder="Ex: Directeur Technique"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={form.contactEmail}
                                        onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                        placeholder="email@entreprise.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={form.contactPhone}
                                        onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                        placeholder="06 XX XX XX XX"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 mb-4">💼 Opportunité</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valeur potentielle (€)
                                </label>
                                <input
                                    type="number"
                                    value={form.potentialValue}
                                    onChange={(e) => setForm({ ...form, potentialValue: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Probabilité de succès: {form.probability}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={form.probability}
                                    onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de conclusion estimée
                                </label>
                                <input
                                    type="date"
                                    value={form.expectedDate}
                                    onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>

                            <div className="pt-4 border-t">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.hasProjects}
                                        onChange={(e) => setForm({ ...form, hasProjects: e.target.checked })}
                                        className="w-5 h-5 text-[#c8102e]"
                                    />
                                    <span className="font-medium">Le client a des projets en cours</span>
                                </label>

                                {form.hasProjects && (
                                    <div className="mt-4 space-y-3 pl-8">
                                        <input
                                            type="text"
                                            value={form.projectDescription}
                                            onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                            placeholder="Description du projet"
                                        />
                                        <input
                                            type="date"
                                            value={form.projectDeadline}
                                            onChange={(e) => setForm({ ...form, projectDeadline: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-4 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300"
                        >
                            ← Précédent
                        </button>
                    )}
                    <div className="flex-1" />
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Annuler
                    </button>
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 bg-[#c8102e] text-white rounded-lg font-medium hover:bg-[#a00d24]"
                        >
                            Suivant →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-[#c8102e] text-white rounded-lg font-medium hover:bg-[#a00d24]"
                        >
                            ✓ Créer le prospect
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewProspectModal;
