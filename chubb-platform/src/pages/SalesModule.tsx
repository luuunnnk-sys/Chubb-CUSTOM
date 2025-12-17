import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface SalesModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
    deviceMode: 'pc' | 'tablet';
}

// URL Vercel de chubb-sales-app
const SALES_APP_URL = import.meta.env.VITE_SALES_APP_URL || 'https://chubb-sales.vercel.app';

const SalesModule = ({ isFullscreen, deviceMode }: SalesModuleProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const iframeSrc = `${SALES_APP_URL}?mode=${deviceMode}`;

    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        // Force iframe reload
        const iframe = document.getElementById('sales-iframe') as HTMLIFrameElement;
        if (iframe) {
            iframe.src = iframe.src;
        }
    };

    if (hasError) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: isFullscreen ? '100vh' : 'calc(100vh - 60px)',
                padding: '24px',
                textAlign: 'center',
                background: '#0f172a'
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
                        Module Sales non disponible
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: 1.6 }}>
                        L'application Chubb Sales n'a pas pu être chargée.
                    </p>
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
                        <RefreshCw size={16} />
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
            background: '#f8fafc'
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
                        <p style={{ color: '#94a3b8' }}>Chargement de Chubb Sales...</p>
                    </div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            {/* Iframe */}
            <iframe
                id="sales-iframe"
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
                title="Chubb Sales Application"
            />
        </div>
    );
};

export default SalesModule;
