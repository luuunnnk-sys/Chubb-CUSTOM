import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface Security3DModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
    deviceMode: 'pc' | 'tablet';
}

const Security3DModule = ({ refreshTrigger, isFullscreen, deviceMode }: Security3DModuleProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    // Use environment variable in production, fallback to localhost for development
    const SECURITY_3D_URL = import.meta.env.VITE_SECURITY_3D_URL || 'http://localhost:8000';
    const [iframeSrc, setIframeSrc] = useState(`${SECURITY_3D_URL}?mode=${deviceMode}`);

    useEffect(() => {
        // Check if the 3D app is running
        const checkServer = async () => {
            try {
                const response = await fetch(SECURITY_3D_URL, { mode: 'no-cors' });
                if (response) {
                    setIsLoading(false);
                    setHasError(false);
                }
            } catch {
                setHasError(true);
                setIsLoading(false);
            }
        };

        const timer = setTimeout(checkServer, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Handle refresh from parent
    useEffect(() => {
        if (refreshTrigger > 0) {
            setIsLoading(true);
            setIframeSrc('');
            setTimeout(() => {
                setIframeSrc(SECURITY_3D_URL);
                setIsLoading(false);
            }, 100);
        }
    }, [refreshTrigger]);

    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        setIframeSrc('');
        setTimeout(() => {
            setIframeSrc(SECURITY_3D_URL);
        }, 100);
    };

    if (hasError) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 56px)',
                marginTop: '56px',
                padding: '24px',
                textAlign: 'center'
            }}>
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '16px',
                    padding: '48px',
                    maxWidth: '500px'
                }}>
                    <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '24px' }} />
                    <h2 style={{ color: '#f8fafc', marginBottom: '16px' }}>
                        Module 3D non disponible
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: 1.6 }}>
                        L'application Architecture & Sécurité 3D n'est pas démarrée.
                        Veuillez lancer le serveur backend avec la commande suivante :
                    </p>
                    <code style={{
                        display: 'block',
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '16px',
                        borderRadius: '8px',
                        color: '#3b82f6',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        marginBottom: '24px'
                    }}>
                        cd DETECTION-EXTINCTION-CHUBB/backend && python main.py
                    </code>
                    <button
                        onClick={handleRetry}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            margin: '0 auto',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

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
                    onError={() => setHasError(true)}
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
