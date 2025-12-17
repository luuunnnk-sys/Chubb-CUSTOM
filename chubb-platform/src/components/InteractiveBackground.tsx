import { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const gradientOffsetRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            const width = canvas.width;
            const height = canvas.height;

            gradientOffsetRef.current += 0.5;
            const t = gradientOffsetRef.current * 0.01;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Animated gradient background
            const gradient = ctx.createLinearGradient(
                width / 2 + Math.sin(t) * width / 3,
                0,
                width / 2 + Math.cos(t) * width / 3,
                height
            );

            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(0.5, '#1e293b');
            gradient.addColorStop(1, '#0f172a');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Grid pattern
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 60) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += 60) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Glowing orbs
            // Blue orb (main)
            const orb1X = width * 0.2 + Math.sin(t * 0.5) * 100;
            const orb1Y = height * 0.3 + Math.cos(t * 0.3) * 50;
            const orb1Gradient = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 350);
            orb1Gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
            orb1Gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = orb1Gradient;
            ctx.fillRect(0, 0, width, height);

            // Red orb (accent)
            const orb2X = width * 0.8 + Math.cos(t * 0.4) * 80;
            const orb2Y = height * 0.7 + Math.sin(t * 0.6) * 60;
            const orb2Gradient = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 300);
            orb2Gradient.addColorStop(0, 'rgba(220, 38, 38, 0.12)');
            orb2Gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = orb2Gradient;
            ctx.fillRect(0, 0, width, height);

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
            }}
        />
    );
};

export default InteractiveBackground;
