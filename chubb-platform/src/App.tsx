import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SketchModule from './pages/SketchModule';
import Security3DModule from './pages/Security3DModule';
import SalesModule from './pages/SalesModule';
import Navigation from './components/Navigation';

function AppContent() {
    const [currentModule, setCurrentModule] = useState<'home' | 'sketch' | '3d' | 'sales'>('home');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const location = useLocation();

    // Sync current module with route
    const effectiveModule = location.pathname === '/sketch' ? 'sketch'
        : location.pathname === '/3d' ? '3d'
            : location.pathname === '/sales' ? 'sales'
                : 'home';

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleToggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

    return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {effectiveModule !== 'home' && !isFullscreen && (
                <Navigation
                    currentModule={effectiveModule}
                    onNavigate={setCurrentModule}
                    onRefresh={handleRefresh}
                    onToggleFullscreen={handleToggleFullscreen}
                    isFullscreen={isFullscreen}
                />
            )}

            {/* Floating exit fullscreen button when in fullscreen mode */}
            {isFullscreen && (
                <button
                    onClick={handleToggleFullscreen}
                    style={{
                        position: 'fixed',
                        top: '16px',
                        left: '16px',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        color: '#f8fafc',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                >
                    ✕ Quitter plein écran
                </button>
            )}

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Routes>
                    <Route path="/" element={<LandingPage onSelectModule={setCurrentModule} />} />
                    <Route path="/sketch" element={
                        <SketchModule
                            refreshTrigger={refreshTrigger}
                            isFullscreen={isFullscreen}
                        />
                    } />
                    <Route path="/3d" element={
                        <Security3DModule
                            refreshTrigger={refreshTrigger}
                            isFullscreen={isFullscreen}
                        />
                    } />
                    <Route path="/sales" element={
                        <SalesModule
                            refreshTrigger={refreshTrigger}
                            isFullscreen={isFullscreen}
                        />
                    } />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
