import React, { useState, useRef, useCallback } from 'react';
import { RotateCw } from 'lucide-react';

interface TouchRotationWheelProps {
    currentRotation: number;
    onRotationChange: (angle: number) => void;
    snapAngles?: number[];
    visible: boolean;
}

/**
 * Roue de rotation tactile pour iPad/Tablette
 * Permet de faire tourner un équipement en glissant le doigt sur la roue
 */
const TouchRotationWheel: React.FC<TouchRotationWheelProps> = ({
    currentRotation,
    onRotationChange,
    snapAngles = [0, 45, 90, 135, 180, 225, 270, 315],
    visible
}) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [startRotation, setStartRotation] = useState(0);

    // Calculer l'angle depuis le centre du wheel
    const getAngleFromCenter = useCallback((clientX: number, clientY: number) => {
        if (!wheelRef.current) return 0;
        const rect = wheelRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }, []);

    // Snap vers l'angle le plus proche
    const snapToAngle = useCallback((angle: number) => {
        // Normaliser entre 0 et 360
        let normalized = ((angle % 360) + 360) % 360;

        // Trouver l'angle snap le plus proche
        let closest = snapAngles[0];
        let minDiff = Math.abs(normalized - closest);

        for (const snapAngle of snapAngles) {
            const diff = Math.abs(normalized - snapAngle);
            if (diff < minDiff) {
                minDiff = diff;
                closest = snapAngle;
            }
        }

        // Snap si proche de 15°
        if (minDiff < 15) {
            return closest;
        }
        return normalized;
    }, [snapAngles]);

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        setIsDragging(true);
        setStartAngle(getAngleFromCenter(touch.clientX, touch.clientY));
        setStartRotation(currentRotation);
    }, [currentRotation, getAngleFromCenter]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const currentAngle = getAngleFromCenter(touch.clientX, touch.clientY);
        const deltaAngle = currentAngle - startAngle;
        let newRotation = startRotation + deltaAngle;
        onRotationChange(newRotation);
    }, [isDragging, startAngle, startRotation, getAngleFromCenter, onRotationChange]);

    const handleTouchEnd = useCallback(() => {
        if (isDragging) {
            // Snap final
            const snapped = snapToAngle(currentRotation);
            onRotationChange(snapped);
        }
        setIsDragging(false);
    }, [isDragging, currentRotation, snapToAngle, onRotationChange]);

    // Quick rotation buttons
    const rotateBy = (degrees: number) => {
        const newRotation = snapToAngle(currentRotation + degrees);
        onRotationChange(newRotation);
    };

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '120px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                zIndex: 1000,
                touchAction: 'none',
            }}
        >
            {/* Label */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 500,
            }}>
                {Math.round(((currentRotation % 360) + 360) % 360)}°
            </div>

            {/* Rotation Wheel */}
            <div
                ref={wheelRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.4) 100%)',
                    border: '3px solid rgba(34, 197, 94, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: isDragging
                        ? '0 0 20px rgba(34, 197, 94, 0.6)'
                        : '0 4px 12px rgba(0, 0, 0, 0.3)',
                    transition: 'box-shadow 0.2s',
                    cursor: 'grab',
                }}
            >
                {/* Indicateur de rotation */}
                <div
                    style={{
                        width: '8px',
                        height: '40px',
                        background: '#22c55e',
                        borderRadius: '4px',
                        position: 'absolute',
                        top: '10px',
                        transformOrigin: 'center bottom',
                        transform: `rotate(${currentRotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                />

                {/* Icône centrale */}
                <RotateCw
                    size={32}
                    color="rgba(34, 197, 94, 0.8)"
                    style={{
                        transform: `rotate(${currentRotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                />

                {/* Marqueurs d'angles snap */}
                {snapAngles.map((angle) => (
                    <div
                        key={angle}
                        style={{
                            position: 'absolute',
                            width: '4px',
                            height: '8px',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '2px',
                            top: '4px',
                            left: '50%',
                            marginLeft: '-2px',
                            transformOrigin: 'center 56px',
                            transform: `rotate(${angle}deg)`,
                        }}
                    />
                ))}
            </div>

            {/* Quick rotation buttons */}
            <div style={{
                display: 'flex',
                gap: '8px',
            }}>
                <button
                    onClick={() => rotateBy(-45)}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '2px solid rgba(34, 197, 94, 0.6)',
                        color: '#22c55e',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                >
                    ↺
                </button>
                <button
                    onClick={() => rotateBy(45)}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '2px solid rgba(34, 197, 94, 0.6)',
                        color: '#22c55e',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                >
                    ↻
                </button>
            </div>
        </div>
    );
};

export default TouchRotationWheel;
