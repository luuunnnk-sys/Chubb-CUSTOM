import React from 'react';
import type { DeviceMode } from '../hooks/useDeviceMode';

interface DeviceToggleProps {
    mode: DeviceMode;
    onChange: (mode: DeviceMode) => void;
}

/**
 * Toggle PC (souris + clavier) / iPad (stylet + tactile)
 * Design compact pour la sidebar
 */
const DeviceToggle: React.FC<DeviceToggleProps> = ({ mode, onChange }) => {
    return (
        <div className="device-toggle">
            <button
                onClick={() => onChange('pc')}
                className={`device-toggle-btn ${mode === 'pc' ? 'active' : ''}`}
                title="Mode PC - Souris + Clavier"
            >
                <span className="device-icon">💻</span>
                <span className="device-label">PC</span>
            </button>
            <button
                onClick={() => onChange('tablet')}
                className={`device-toggle-btn ${mode === 'tablet' ? 'active tablet' : ''}`}
                title="Mode iPad - Stylet + Tactile"
            >
                <span className="device-icon">📱</span>
                <span className="device-label">iPad</span>
            </button>
        </div>
    );
};

export default DeviceToggle;
