import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Flame, Building2, Monitor, Tablet } from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';

interface LandingPageProps {
    onSelectModule: (module: 'home' | 'sketch' | '3d' | 'sales') => void;
    deviceMode: 'pc' | 'tablet';
    onDeviceModeChange: (mode: 'pc' | 'tablet') => void;
}

const LandingPage = ({ onSelectModule, deviceMode, onDeviceModeChange }: LandingPageProps) => {
    const navigate = useNavigate();

    const handleSelectModule = (module: 'sketch' | '3d' | 'sales') => {
        onSelectModule(module);
        navigate(module === 'sketch' ? '/sketch' : module === '3d' ? '/3d' : '/sales');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Interactive Animated Background with Wipe Effect */}
            <InteractiveBackground />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '60px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                justifyContent: 'center'
            }}>
                {/* Logo & Brand */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '48px',
                    animation: 'fade-in 0.8s ease-out'
                }}>
                    {/* Logo */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto 32px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #dc2626 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)',
                        animation: 'pulse-glow 3s ease-in-out infinite'
                    }}>
                        <Shield size={56} color="white" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 800,
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #dc2626 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Chubb Platform
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#94a3b8',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.7
                    }}>
                        Solutions professionnelles de sécurité incendie.
                        <br />
                        Conception, visualisation et dimensionnement de systèmes de détection et d'extinction.
                    </p>
                </div>

                {/* Device Mode Toggle */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '40px',
                    padding: '16px 24px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: 'fade-in 0.8s ease-out 0.2s both'
                }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>
                        Interface :
                    </span>
                    <div style={{
                        display: 'flex',
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '12px',
                        padding: '4px',
                        gap: '4px'
                    }}>
                        <button
                            onClick={() => onDeviceModeChange('pc')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                transition: 'all 0.2s ease',
                                background: deviceMode === 'pc'
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                    : 'transparent',
                                color: deviceMode === 'pc' ? '#ffffff' : '#94a3b8',
                                boxShadow: deviceMode === 'pc'
                                    ? '0 4px 12px rgba(59, 130, 246, 0.4)'
                                    : 'none'
                            }}
                        >
                            <Monitor size={18} />
                            PC / Desktop
                        </button>
                        <button
                            onClick={() => onDeviceModeChange('tablet')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                transition: 'all 0.2s ease',
                                background: deviceMode === 'tablet'
                                    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                    : 'transparent',
                                color: deviceMode === 'tablet' ? '#ffffff' : '#94a3b8',
                                boxShadow: deviceMode === 'tablet'
                                    ? '0 4px 12px rgba(220, 38, 38, 0.4)'
                                    : 'none'
                            }}
                        >
                            <Tablet size={18} />
                            iPad / Tablette
                        </button>
                    </div>
                </div>

                {/* Module Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '1100px',
                    marginBottom: '48px'
                }}>
                    {/* Sketch Module Card */}
                    <ModuleCard
                        title="Chubb Sketch"
                        subtitle="Plans & Schémas 2D"
                        description="Dessinez vos plans d'installation avec les équipements de détection et d'extinction. Export PDF professionnel."
                        logoSrc="/sketch-logo.png"
                        features={['Import plans PDF/Image', 'Placement équipements', 'Cartouche personnalisé', 'Export PDF']}
                        accentColor="#22c55e"
                        onClick={() => handleSelectModule('sketch')}
                        delay={0.1}
                    />

                    {/* 3D Security Module Card */}
                    <ModuleCard
                        title="Architecture 3D"
                        subtitle="Sécurité & Extinction"
                        description="Visualisez en 3D vos locaux techniques avec calculs automatiques des systèmes d'extinction gazeuse."
                        logoSrc="/security-3d-logo.png"
                        features={['Modélisation 3D', 'Détection VESDA', 'Calculs IG55/Hi-Fog', 'Rapport PDF']}
                        accentColor="#3b82f6"
                        onClick={() => handleSelectModule('3d')}
                        delay={0.2}
                    />

                    {/* Sales CRM Module Card */}
                    <ModuleCard
                        title="Chubb Sales"
                        subtitle="CRM Commercial B2B"
                        description="Gérez vos prospects avec l'analyse SONCAS, le planning intégré et le scoring automatique."
                        logoSrc="/sales-logo.png"
                        features={['Gestion prospects', 'Analyse SONCAS', 'Planning intégré', 'Score automatique']}
                        accentColor="#c8102e"
                        onClick={() => handleSelectModule('sales')}
                        delay={0.3}
                    />
                </div>

                {/* Features Highlights */}
                <div style={{
                    display: 'flex',
                    gap: '48px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '24px',
                    animation: 'fade-in 0.8s ease-out 0.4s both'
                }}>
                    <FeatureHighlight icon={<Flame size={20} />} text="Normes EN & NF" />
                    <FeatureHighlight icon={<Building2 size={20} />} text="Tous types de locaux" />
                    <FeatureHighlight icon={<Shield size={20} />} text="Chubb France" />
                </div>

                {/* Footer */}
                <footer style={{
                    marginTop: 'auto',
                    paddingTop: '48px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '14px'
                }}>
                    © 2025 Chubb France - Tous droits réservés
                </footer>
            </div>
        </div>
    );
};

// Module Card Component
interface ModuleCardProps {
    title: string;
    subtitle: string;
    description: string;
    logoSrc: string;
    features: string[];
    accentColor: string;
    onClick: () => void;
    delay: number;
}

const ModuleCard = ({ title, subtitle, description, logoSrc, features, accentColor, onClick, delay }: ModuleCardProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'rgba(30, 41, 59, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '32px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fade-in 0.6s ease-out ${delay}s both`,
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.transform = 'translateY(-8px) scale(1.02)';
                target.style.boxShadow = `0 20px 40px ${accentColor}30`;
                target.style.borderColor = `${accentColor}50`;
            }}
            onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = 'none';
                target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
        >
            {/* Logo Image */}
            <div style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <img
                    src={logoSrc}
                    alt={`${title} logo`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                    }}
                />
            </div>

            {/* Title */}
            <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: '4px'
            }}>
                {title}
            </h3>

            {/* Subtitle */}
            <p style={{
                fontSize: '0.875rem',
                color: accentColor,
                fontWeight: 600,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {subtitle}
            </p>

            {/* Description */}
            <p style={{
                fontSize: '0.95rem',
                color: '#94a3b8',
                marginBottom: '24px',
                lineHeight: 1.6
            }}>
                {description}
            </p>

            {/* Features List */}
            <ul style={{
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '24px'
            }}>
                {features.map((feature, index) => (
                    <li key={index} style={{
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: accentColor
                        }} />
                        {feature}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: accentColor,
                fontWeight: 600,
                fontSize: '0.95rem'
            }}>
                Ouvrir le module
                <ArrowRight size={18} style={{ transition: 'transform 0.2s' }} />
            </div>
        </button>
    );
};

// Feature Highlight Component
const FeatureHighlight = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#64748b',
        fontSize: '0.9rem'
    }}>
        <span style={{ color: '#22c55e' }}>{icon}</span>
        {text}
    </div>
);

export default LandingPage;
