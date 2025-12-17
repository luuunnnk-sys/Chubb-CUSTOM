export interface SalesModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
    deviceMode: 'pc' | 'tablet';
}

const SalesModule = ({ refreshTrigger, isFullscreen, deviceMode }: SalesModuleProps) => {
    // Use environment variable in production, fallback to localhost for development
    const SALES_APP_URL = import.meta.env.VITE_SALES_APP_URL || 'http://localhost:5175';

    return (
        <div style={{
            width: '100%',
            height: isFullscreen ? '100vh' : 'calc(100vh - 60px)',
            display: 'flex',
            flexDirection: 'column',
            background: '#f8fafc'
        }}>
            <iframe
                key={refreshTrigger}
                src={`${SALES_APP_URL}?mode=${deviceMode}`}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
                title="Chubb Sales"
            />
        </div>
    );
};

export default SalesModule;
