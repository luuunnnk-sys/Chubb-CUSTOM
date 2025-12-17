import { useState } from 'react';
import { Monitor, Tablet } from 'lucide-react';

interface DeviceToggleProps {
    mode: 'pc' | 'tablet';
    onChange: (mode: 'pc' | 'tablet') => void;
}

const DeviceToggle = ({ mode, onChange }: DeviceToggleProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleModeChange = (newMode: 'pc' | 'tablet') => {
        onChange(newMode);
        setIsOpen(false);
        // Sauvegarder dans localStorage
        localStorage.setItem('chubb_device_mode', newMode);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: mode === 'tablet'
                        ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                        : 'rgba(51, 65, 85, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {mode === 'tablet' ? (
                    <>
                        <Tablet size={18} />
                        <span>iPad/Tablette</span>
                    </>
                ) : (
                    <>
                        <Monitor size={18} />
                        <span>PC</span>
                    </>
                )}
                <span style={{
                    marginLeft: '4px',
                    opacity: 0.7,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }}>▼</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'rgba(15, 23, 42, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '8px',
                        minWidth: '200px',
                        zIndex: 1000,
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <button
                        onClick={() => handleModeChange('pc')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px 16px',
                            background: mode === 'pc' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            if (mode !== 'pc') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            if (mode !== 'pc') e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Monitor size={20} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Mode PC</div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>Souris + Clavier</div>
                        </div>
                        {mode === 'pc' && <span style={{ marginLeft: 'auto', color: '#22c55e' }}>✓</span>}
                    </button>

                    <button
                        onClick={() => handleModeChange('tablet')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px 16px',
                            background: mode === 'tablet' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.2s',
                            marginTop: '4px',
                        }}
                        onMouseEnter={(e) => {
                            if (mode !== 'tablet') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            if (mode !== 'tablet') e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Tablet size={20} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Mode iPad/Tablette</div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>Tactile + Stylet</div>
                        </div>
                        {mode === 'tablet' && <span style={{ marginLeft: 'auto', color: '#3b82f6' }}>✓</span>}
                    </button>
                </div>
            )}

            {/* Overlay pour fermer */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 999,
                    }}
                />
            )}
        </div>
    );
};

export default DeviceToggle;
