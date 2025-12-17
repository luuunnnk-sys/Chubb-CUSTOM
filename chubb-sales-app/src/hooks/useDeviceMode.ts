import { useState, useEffect } from 'react';

export type DeviceMode = 'pc' | 'tablet';

/**
 * Hook pour gérer le mode d'utilisation (PC souris/clavier ou iPad stylet/tactile)
 * - Détection automatique des appareils tactiles
 * - Persistence localStorage
 * - Support URL params pour intégration Platform
 */
export function useDeviceMode(): [DeviceMode, (mode: DeviceMode) => void] {
    const [mode, setMode] = useState<DeviceMode>(() => {
        // 1. Vérifier URL params (si vient de Platform)
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get('mode');
        if (urlMode === 'tablet') return 'tablet';

        // 2. Vérifier localStorage
        const saved = localStorage.getItem('chubb_sales_device_mode');
        if (saved === 'tablet') return 'tablet';
        if (saved === 'pc') return 'pc';

        // 3. Détection automatique touch device
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return isTouch ? 'tablet' : 'pc';
    });

    const handleSetMode = (newMode: DeviceMode) => {
        setMode(newMode);
        localStorage.setItem('chubb_sales_device_mode', newMode);

        // Ajouter/retirer classe sur body pour styles globaux
        if (newMode === 'tablet') {
            document.body.classList.add('tablet-mode');
            document.body.classList.remove('pc-mode');
        } else {
            document.body.classList.add('pc-mode');
            document.body.classList.remove('tablet-mode');
        }
    };

    // Appliquer la classe initiale
    useEffect(() => {
        if (mode === 'tablet') {
            document.body.classList.add('tablet-mode');
        } else {
            document.body.classList.add('pc-mode');
        }
    }, []);

    return [mode, handleSetMode];
}

/**
 * Hook pour détecter si l'appareil est tactile
 */
export function useIsTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0
        );
    }, []);

    return isTouch;
}

export default useDeviceMode;
