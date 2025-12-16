import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';

interface NavigationProps {
    currentModule: 'home' | 'sketch' | '3d' | 'sales';
    onNavigate: (module: 'home' | 'sketch' | '3d' | 'sales') => void;
    onRefresh?: () => void;
    onToggleFullscreen?: () => void;
    isFullscreen?: boolean;
}

const Navigation = ({
    currentModule,
    onNavigate,
    onRefresh,
    onToggleFullscreen,
    isFullscreen = false
}: NavigationProps) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        onNavigate('home');
        navigate('/');
    };

    const getModuleTitle = () => {
        switch (currentModule) {
            case 'sketch': return 'Chubb Sketch - Plans 2D';
            case '3d': return 'Architecture & Sécurité 3D';
            case 'sales': return 'Chubb Sales - CRM Commercial';
            default: return 'Chubb Platform';
        }
    };

    const getAccentColor = () => {
        switch (currentModule) {
            case 'sketch': return '#22c55e';
            case '3d': return '#3b82f6';
            case 'sales': return '#c8102e';
            default: return '#22c55e';
        }
    };

    const accentColor = getAccentColor();

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '56px',
            background: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            zIndex: 1000,
            gap: '16px'
        }}>
            {/* Back to Home Button */}
            <button
                onClick={handleGoHome}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}40`,
                    borderRadius: '8px',
                    color: accentColor,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${accentColor}25`;
                    e.currentTarget.style.borderColor = `${accentColor}60`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${accentColor}15`;
                    e.currentTarget.style.borderColor = `${accentColor}40`;
                }}
            >
                <ArrowLeft size={18} />
                <Home size={18} />
                <span>Accueil</span>
            </button>

            {/* Module Title */}
            <h1 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#f8fafc',
                margin: 0
            }}>
                {getModuleTitle()}
            </h1>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Module Action Buttons */}
            {(onRefresh || onToggleFullscreen) && (
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginRight: '16px'
                }}>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            title="Actualiser le module"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                background: 'rgba(51, 65, 85, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                fontSize: '13px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(51, 65, 85, 0.9)';
                                e.currentTarget.style.color = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)';
                                e.currentTarget.style.color = '#94a3b8';
                            }}
                        >
                            <RefreshCw size={16} />
                            <span>Actualiser</span>
                        </button>
                    )}

                    {onToggleFullscreen && (
                        <button
                            onClick={onToggleFullscreen}
                            title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                background: isFullscreen ? `${accentColor}20` : 'rgba(51, 65, 85, 0.6)',
                                border: `1px solid ${isFullscreen ? `${accentColor}40` : 'rgba(255, 255, 255, 0.1)'}`,
                                borderRadius: '8px',
                                color: isFullscreen ? accentColor : '#94a3b8',
                                cursor: 'pointer',
                                fontSize: '13px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = isFullscreen ? `${accentColor}30` : 'rgba(51, 65, 85, 0.9)';
                                e.currentTarget.style.color = isFullscreen ? accentColor : '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = isFullscreen ? `${accentColor}20` : 'rgba(51, 65, 85, 0.6)';
                                e.currentTarget.style.color = isFullscreen ? accentColor : '#94a3b8';
                            }}
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            <span>{isFullscreen ? 'Réduire' : 'Plein écran'}</span>
                        </button>
                    )}
                </div>
            )}

            {/* Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    fontWeight: 500
                }}>
                    Chubb Platform
                </span>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px'
                }}>
                    C
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
