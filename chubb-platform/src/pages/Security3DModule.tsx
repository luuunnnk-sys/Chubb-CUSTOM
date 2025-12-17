import { useEffect, useState } from 'react';

export interface Security3DModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
    deviceMode: 'pc' | 'tablet';
}

const Security3DModule = ({ refreshTrigger, isFullscreen, deviceMode }: Security3DModuleProps) => {
    const [isLoading, setIsLoading] = useState(true);
    // Load 3D app from public folder (no external server needed for UI)
    const [iframeSrc, setIframeSrc] = useState(`/3d/app.html?mode=${deviceMode}`);

    // Handle refresh from parent
    useEffect(() => {
        if (refreshTrigger > 0) {
            setIsLoading(true);
            setIframeSrc('');
            setTimeout(() => {
                setIframeSrc(`/3d/app.html?mode=${deviceMode}`);
                setIsLoading(false);
            }, 100);
        }
    }, [refreshTrigger, deviceMode]);

    // Update deviceMode when it changes
    useEffect(() => {
        setIframeSrc(`/3d/app.html?mode=${deviceMode}`);
    }, [deviceMode]);

    return (
        <div style={{
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : '56px',
            left: 0,
            right: 0,
            bottom: 0,
            height: isFullscreen ? '100vh' : 'calc(100vh - 56px)',
            zIndex: isFullscreen ? 9999 : 1,
            background: '#0f172a'
        }}>
            {/* Loading State */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                    zIndex: 5
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '3px solid rgba(59, 130, 246, 0.2)',
                            borderTopColor: '#3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{ color: '#94a3b8' }}>Chargement de l'Architecture 3D...</p>
                    </div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            {/* Iframe */}
            {iframeSrc && (
                <iframe
                    id="security-3d-iframe"
                    src={iframeSrc}
                    onLoad={() => setIsLoading(false)}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        opacity: isLoading ? 0 : 1,
                        transition: 'opacity 0.3s ease'
                    }}
                    title="Architecture & Sécurité 3D Application"
                />
            )}
        </div>
    );
};

export default Security3DModule;
