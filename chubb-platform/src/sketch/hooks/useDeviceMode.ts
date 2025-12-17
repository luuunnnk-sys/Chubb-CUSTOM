import { useState, useEffect } from 'react';

export type DeviceMode = 'pc' | 'tablet';

/**
 * Hook pour détecter le mode d'utilisation (PC ou iPad/Tablette)
 * Le mode est passé via URL param ?mode=tablet ou ?mode=pc
 */
export function useDeviceMode(): DeviceMode {
    const [mode, setMode] = useState<DeviceMode>('pc');

    useEffect(() => {
        // Récupérer le mode depuis les paramètres URL
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get('mode');

        if (urlMode === 'tablet') {
            setMode('tablet');
        } else {
            setMode('pc');
        }

        // Écouter les changements d'URL (si navigation SPA)
        const handlePopState = () => {
            const newParams = new URLSearchParams(window.location.search);
            const newMode = newParams.get('mode');
            setMode(newMode === 'tablet' ? 'tablet' : 'pc');
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return mode;
}

/**
 * Hook pour détecter si l'écran est tactile (pour la détection automatique)
 */
export function useIsTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
            setIsTouch(
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                // @ts-ignore - pour les anciens navigateurs
                navigator.msMaxTouchPoints > 0
            );
        };

        checkTouch();
    }, []);

    return isTouch;
}

export default useDeviceMode;
