import React from 'react';
import DeviceToggle from './DeviceToggle';
import type { DeviceMode } from '../hooks/useDeviceMode';

interface SidebarProps {
    currentView: 'dashboard' | 'prospects' | 'planning';
    onChangeView: (view: 'dashboard' | 'prospects' | 'planning') => void;
    onNewProspect: () => void;
    deviceMode: DeviceMode;
    onDeviceModeChange: (mode: DeviceMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    currentView,
    onChangeView,
    onNewProspect,
    deviceMode,
    onDeviceModeChange
}) => {
    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
        { id: 'prospects', label: 'Prospects', icon: '👥' },
        { id: 'planning', label: 'Planning', icon: '📅' },
    ] as const;

    return (
        <aside className="w-64 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white flex flex-col shadow-xl">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <img
                        src="/sales-logo.png"
                        alt="Chubb Sales"
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1"
                    />
                    <div>
                        <h1 className="font-bold text-lg">Chubb Sales</h1>
                        <p className="text-xs text-gray-400">CRM Commercial</p>
                    </div>
                </div>
            </div>

            {/* Bouton Nouveau Prospect */}
            <div className="p-4">
                <button
                    onClick={onNewProspect}
                    className="w-full py-3 bg-[#c8102e] hover:bg-[#a00d24] rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    <span className="text-xl">+</span>
                    Nouveau Prospect
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChangeView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${currentView === item.id
                            ? 'bg-white/20 text-white'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Device Toggle */}
            <div className="px-4 py-3 border-t border-white/10">
                <DeviceToggle mode={deviceMode} onChange={onDeviceModeChange} />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-xs text-gray-400 text-center">
                Chubb France © 2025
            </div>
        </aside>
    );
};

export default Sidebar;

