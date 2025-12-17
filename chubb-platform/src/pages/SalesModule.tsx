export interface SalesModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
    deviceMode: 'pc' | 'tablet';
}

const SalesModule = ({ refreshTrigger, isFullscreen, deviceMode }: SalesModuleProps) => {
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
                src={`http://localhost:5175?mode=${deviceMode}`}
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
