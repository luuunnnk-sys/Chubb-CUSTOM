import React, { useState, useEffect } from 'react';
import { Monitor, Tablet } from 'lucide-react';

export type DeviceMode = 'pc' | 'tablet';

interface DeviceToggleProps {
    mode: DeviceMode;
    onChange: (mode: DeviceMode) => void;
}

/**
 * Toggle PC/iPad pour Chubb Sketch - version standalone
 */
const DeviceToggle: React.FC<DeviceToggleProps> = ({ mode, onChange }) => {
    return (
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
                onClick={() => onChange('pc')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'pc'
                        ? 'bg-white shadow text-slate-800'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                <Monitor size={16} />
                <span>PC</span>
            </button>
            <button
                onClick={() => onChange('tablet')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'tablet'
                        ? 'bg-blue-500 shadow text-white'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                <Tablet size={16} />
                <span>iPad</span>
            </button>
        </div>
    );
};

/**
 * Hook pour gérer le mode device avec persistence localStorage
 */
export function useDeviceMode(): [DeviceMode, (mode: DeviceMode) => void] {
    const [mode, setMode] = useState<DeviceMode>(() => {
        // Vérifier URL params d'abord (si vient de Platform)
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get('mode');
        if (urlMode === 'tablet') return 'tablet';

        // Sinon localStorage
        const saved = localStorage.getItem('chubb_sketch_device_mode');
        if (saved === 'tablet') return 'tablet';

        // Détection automatique touch device
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return isTouch ? 'tablet' : 'pc';
    });

    const handleSetMode = (newMode: DeviceMode) => {
        setMode(newMode);
        localStorage.setItem('chubb_sketch_device_mode', newMode);
    };

    return [mode, handleSetMode];
}

export default DeviceToggle;
