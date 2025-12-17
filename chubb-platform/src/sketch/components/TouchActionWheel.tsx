import React, { useState, useRef, useCallback } from 'react';
import { RotateCw, Trash2, Move, X } from 'lucide-react';

interface TouchActionWheelProps {
    currentRotation: number;
    onRotationChange: (angle: number) => void;
    onDelete: () => void;
    onToggleDrag: () => void;
    onDeselect: () => void;
    isDragging: boolean;
    snapAngles?: number[];
    visible: boolean;
}

/**
 * Roue d'actions tactile pour iPad/Tablette
 * Permet de faire tourner, supprimer, déplacer ou désélectionner un équipement
 */
const TouchActionWheel: React.FC<TouchActionWheelProps> = ({
    currentRotation,
    onRotationChange,
    onDelete,
    onToggleDrag,
    onDeselect,
    isDragging,
    snapAngles = [0, 45, 90, 135, 180, 225, 270, 315],
    visible
}) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const [isRotating, setIsRotating] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [startRotation, setStartRotation] = useState(0);

    const getAngleFromCenter = useCallback((clientX: number, clientY: number) => {
        if (!wheelRef.current) return 0;
        const rect = wheelRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    }, []);

    const snapToAngle = useCallback((angle: number) => {
        let normalized = ((angle % 360) + 360) % 360;
        let closest = snapAngles[0];
        let minDiff = Math.abs(normalized - closest);
        for (const snapAngle of snapAngles) {
            const diff = Math.abs(normalized - snapAngle);
            if (diff < minDiff) {
                minDiff = diff;
                closest = snapAngle;
            }
        }
        return minDiff < 15 ? closest : normalized;
    }, [snapAngles]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        // Block rotation when in drag mode
        if (isDragging) return;

        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        setIsRotating(true);
        setStartAngle(getAngleFromCenter(touch.clientX, touch.clientY));
        setStartRotation(currentRotation);
    }, [currentRotation, getAngleFromCenter, isDragging]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isRotating || isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const currentAngle = getAngleFromCenter(touch.clientX, touch.clientY);
        onRotationChange(startRotation + (currentAngle - startAngle));
    }, [isRotating, isDragging, startAngle, startRotation, getAngleFromCenter, onRotationChange]);

    const handleTouchEnd = useCallback(() => {
        if (isRotating && !isDragging) {
            onRotationChange(snapToAngle(currentRotation));
        }
        setIsRotating(false);
    }, [isRotating, isDragging, currentRotation, snapToAngle, onRotationChange]);

    const rotateBy = (degrees: number) => {
        onRotationChange(snapToAngle(currentRotation + degrees));
    };

    const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Supprimer cet équipement ?')) {
            onDelete();
        }
    };

    const handleDragButtonTouch = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleDrag();
    };

    const handleDeselectTouch = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDeselect();
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1000,
            touchAction: 'none',
        }}>
            {/* Deselect Button (X) */}
            <button
                onTouchStart={handleDeselectTouch}
                onClick={() => onDeselect()}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(100, 116, 139, 0.9)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
            >
                <X size={20} />
            </button>

            {/* Delete Button */}
            <button
                onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onClick={handleDelete}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                }}
            >
                <Trash2 size={24} />
            </button>

            {/* Rotation Label */}
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
                    boxShadow: isRotating ? '0 0 20px rgba(34, 197, 94, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
            >
                <div style={{
                    width: '8px',
                    height: '40px',
                    background: '#22c55e',
                    borderRadius: '4px',
                    position: 'absolute',
                    top: '10px',
                    transformOrigin: 'center bottom',
                    transform: `rotate(${currentRotation}deg)`,
                    transition: isRotating ? 'none' : 'transform 0.1s ease-out',
                }} />
                <RotateCw size={32} color="rgba(34, 197, 94, 0.8)" style={{
                    transform: `rotate(${currentRotation}deg)`,
                    transition: isRotating ? 'none' : 'transform 0.1s ease-out',
                }} />
                {snapAngles.map((angle) => (
                    <div key={angle} style={{
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
                    }} />
                ))}
            </div>

            {/* Quick rotation buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); rotateBy(-45); }}
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
                >↺</button>
                <button
                    onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); rotateBy(45); }}
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
                >↻</button>
            </div>

            {/* Drag Mode Button */}
            <button
                onTouchStart={handleDragButtonTouch}
                onClick={() => onToggleDrag()}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: isDragging
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: isDragging ? '3px solid #fff' : 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isDragging ? '0 0 20px rgba(34, 197, 94, 0.8)' : '0 4px 12px rgba(99, 102, 241, 0.4)',
                }}
            >
                <Move size={24} />
            </button>

            {isDragging && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.9)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textAlign: 'center',
                }}>
                    Mode Déplacement<br />
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>Glissez pour bouger</span>
                </div>
            )}
        </div>
    );
};

export default TouchActionWheel;
