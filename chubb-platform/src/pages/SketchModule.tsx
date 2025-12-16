import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface SketchModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
}

const SketchModule = ({ refreshTrigger, isFullscreen }: SketchModuleProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [iframeSrc, setIframeSrc] = useState('http://localhost:5173');

    const SKETCH_APP_URL = 'http://localhost:5173';

    useEffect(() => {
        // Check if the sketch app is running
        const checkServer = async () => {
            try {
                const response = await fetch(SKETCH_APP_URL, { mode: 'no-cors' });
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
                setIframeSrc(SKETCH_APP_URL);
                setIsLoading(false);
            }, 100);
        }
    }, [refreshTrigger]);

    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        setIframeSrc('');
        setTimeout(() => {
            setIframeSrc(SKETCH_APP_URL);
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
                        Module Sketch non disponible
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: 1.6 }}>
                        L'application Chubb Sketch n'est pas démarrée.
                        Veuillez lancer le serveur avec la commande suivante :
                    </p>
                    <code style={{
                        display: 'block',
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '16px',
                        borderRadius: '8px',
                        color: '#22c55e',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        marginBottom: '24px'
                    }}>
                        cd chubb-sketch-app && npm run dev
                    </code>
                    <button
                        onClick={handleRetry}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            margin: '0 auto',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
                            border: '3px solid rgba(34, 197, 94, 0.2)',
                            borderTopColor: '#22c55e',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{ color: '#94a3b8' }}>Chargement de Chubb Sketch...</p>
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
                    id="sketch-iframe"
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
                    title="Chubb Sketch Application"
                />
            )}
        </div>
    );
};

export default SketchModule;
