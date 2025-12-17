import SketchApp from '../sketch/SketchApp';

export interface SketchModuleProps {
    refreshTrigger: number;
    isFullscreen: boolean;
    deviceMode: 'pc' | 'tablet';
}

const SketchModule = ({ isFullscreen, deviceMode }: SketchModuleProps) => {
    return (
        <div style={{
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : '56px',
            left: 0,
            right: 0,
            bottom: 0,
            height: isFullscreen ? '100vh' : 'calc(100vh - 56px)',
            zIndex: isFullscreen ? 9999 : 1,
            background: '#f8fafc',
            overflow: 'hidden'
        }}>
            <SketchApp />
        </div>
    );
};

export default SketchModule;
