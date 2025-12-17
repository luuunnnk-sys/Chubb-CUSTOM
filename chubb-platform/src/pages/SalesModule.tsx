import SalesApp from '../sales/SalesApp';

export interface SalesModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
    deviceMode: 'pc' | 'tablet';
}

const SalesModule = ({ isFullscreen, deviceMode }: SalesModuleProps) => {
    return (
        <div style={{
            width: '100%',
            height: isFullscreen ? '100vh' : 'calc(100vh - 60px)',
            display: 'flex',
            flexDirection: 'column',
            background: '#f8fafc'
        }}>
            <SalesApp deviceMode={deviceMode} />
        </div>
    );
};

export default SalesModule;
