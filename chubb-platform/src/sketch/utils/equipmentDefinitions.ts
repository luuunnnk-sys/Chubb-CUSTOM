import { EquipmentDefinition } from '../types/types';
import { ICONS } from './icons'; // mapping vers /public/icons/*.png

export function getEquipmentDefinitions(): EquipmentDefinition[] {
  return [
    {
      type: 'smoke-detector',
      name: 'Détecteur de Fumée',
      iconSrc: ICONS['smoke-detector'],
      color: '#DC2626',
      description: 'Détecteur automatique de fumée selon NF S 61-970',
      symbol: 'DF',
      page: 1,
      realSizeCm: 13
    },
    {
      type: 'manual-trigger',
      name: 'Déclencheur Manuel',
      iconSrc: ICONS['manual-trigger'],
      color: '#EA580C',
      description: "Déclencheur manuel d'alarme incendie",
      symbol: 'DM',
      page: 1,
      realSizeCm: 13
    },
    {
      type: 'sounder',
      name: 'Diffuseur Sonore',
      iconSrc: ICONS['sounder'],
      color: '#7C3AED',
      description: "Avertisseur sonore d'évacuation",
      symbol: 'DS',
      page: 1,
      realSizeCm: 13
    },
    {
      type: 'flash',
      name: 'Flash',
      iconSrc: ICONS['flash'],
      color: '#0ea5e9',
      description: 'Diffuseur lumineux type BAAS Flash',
      symbol: 'FL',
      page: 1,
      realSizeCm: 13
    },
    {
      type: 'vesda',
      name: 'VESDA',
      iconSrc: ICONS['vesda'],
      color: '#16a34a',
      description: 'Système de détection par aspiration (VESDA)',
      symbol: 'VES',
      page: 1,
      realWidthCm: 28,
      realHeightCm: 16
    },
    {
      type: 'tubing',
      name: 'Tubulure',
      iconSrc: ICONS['tubing'],
      color: '#DC2626',
      description: 'Tubulure rouge pour réseau VESDA',
      symbol: 'TU',
      page: 1,
      realSizeCm: 2.5
    },
    {
      type: 'ia',
      name: 'Indicateur d’Actions (IA)',
      iconSrc: ICONS['ia'],
      color: '#F59E0B',
      description: 'Indicateur visuel/sonore d’actions',
      symbol: 'IA',
      page: 2,
      realSizeCm: 8
    },
    {
      type: 'ssi',
      name: 'Centrale SSI',
      iconSrc: ICONS['ssi'],
      color: '#2563EB',
      description: 'Centrale de sécurité incendie',
      symbol: 'SSI',
      page: 2,
      realWidthCm: 20,
      realHeightCm: 17
    },
    {
      type: 'tre',
      name: 'Tableau de Report (TRE)',
      iconSrc: ICONS['tre'],
      color: '#10B981',
      description: 'Tableau de report des alarmes',
      symbol: 'TRE',
      page: 2,
      realWidthCm: 20,
      realHeightCm: 20
    },
    {
      type: 'thermovelocimetrique',
      name: 'Détecteur Thermovélocimétrique',
      iconSrc: ICONS['thermovelocimetrique'],
      color: '#EF4444',
      description: 'Détecteur de chaleur thermovélocimétrique',
      symbol: 'THV',
      page: 2,
      realSizeCm: 13
    },
    {
      type: 'flamme',
      name: 'Détecteur de Flamme',
      iconSrc: ICONS['flamme'],
      color: '#9333EA',
      description: 'Détecteur optique de flamme',
      symbol: 'DFL',
      page: 2,
      realSizeCm: 13
    },
    {
      type: 'note',
      name: 'Pastille Commentaire',
      iconSrc: ICONS['note'],
      color: '#F97316',
      description: 'Pastille pour ajouter un commentaire lié à un équipement',
      symbol: 'NOTE',
      page: 2,
      realSizeCm: 5
    },
    // ✅ Ajout Bouteille d'Argon (Extinction)
    {
      type: 'argon-cylinder',
      name: 'Bouteille Argon IG55',
      iconSrc: ICONS['argon-cylinder'],
      color: '#22C55E',
      description: 'Bouteille de gaz inerte IG55 pour système d\'extinction',
      symbol: 'ARG',
      page: 1,
      realSizeCm: 12
    },
    // ✅ Ajout Zone
    {
      type: 'zone',
      name: 'Zonage',
      iconSrc: '/icons/zoning.png',  // ➜ place ton zoning.png dans public/icons/
      color: '#00AAFF',
      description: 'Permet de dessiner une zone colorée sur le plan',
      symbol: 'ZONE',
      page: 3
    }
  ];
}
