import { useRef, useCallback, useEffect } from 'react';

interface TouchGestureResult {
    // If pinch detected, provides the scale factor
    pinchScale: number | null;
    // Center point of pinch
    pinchCenter: { x: number; y: number } | null;
    // If pan detected (2 fingers), provides delta
    panDelta: { dx: number; dy: number } | null;
    // Is a touch gesture in progress
    isGesturing: boolean;
}

interface UseTouchGesturesOptions {
    onPinch?: (scale: number, centerX: number, centerY: number) => void;
    onPan?: (dx: number, dy: number) => void;
    onTap?: (x: number, y: number) => void;
    onLongPress?: (x: number, y: number) => void;
    enabled?: boolean;
}

/**
 * Hook pour gérer les gestes tactiles sur iPad/tablette
 * - Pinch-to-zoom (2 doigts)
 * - Pan (2 doigts drag)
 * - Tap (simple touch)
 * - Long press (touch > 500ms)
 */
export function useTouchGestures(
    ref: React.RefObject<HTMLElement>,
    options: UseTouchGesturesOptions
) {
    const { onPinch, onPan, onTap, onLongPress, enabled = true } = options;

    const lastTouchDistance = useRef<number | null>(null);
    const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
    const touchStartTime = useRef<number>(0);
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isGesturing = useRef(false);

    const getDistance = (t1: Touch, t2: Touch) => {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = (t1: Touch, t2: Touch) => ({
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
    });

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        // Clear long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        if (e.touches.length === 1) {
            // Single touch - potential tap or long press
            touchStartTime.current = Date.now();
            touchStartPos.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };

            // Start long press timer
            longPressTimer.current = setTimeout(() => {
                if (touchStartPos.current && onLongPress) {
                    onLongPress(touchStartPos.current.x, touchStartPos.current.y);
                }
            }, 500);
        } else if (e.touches.length === 2) {
            // Two fingers - pinch/pan
            isGesturing.current = true;
            lastTouchDistance.current = getDistance(e.touches[0], e.touches[1]);
            lastTouchCenter.current = getCenter(e.touches[0], e.touches[1]);

            // Cancel long press
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
        }
    }, [enabled, onLongPress]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        // Cancel long press on move
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        if (e.touches.length === 2 && lastTouchDistance.current && lastTouchCenter.current) {
            e.preventDefault(); // Prevent default zoom

            const newDistance = getDistance(e.touches[0], e.touches[1]);
            const newCenter = getCenter(e.touches[0], e.touches[1]);

            // Pinch
            const scale = newDistance / lastTouchDistance.current;
            if (onPinch && Math.abs(scale - 1) > 0.01) {
                onPinch(scale, newCenter.x, newCenter.y);
            }

            // Pan
            const dx = newCenter.x - lastTouchCenter.current.x;
            const dy = newCenter.y - lastTouchCenter.current.y;
            if (onPan && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
                onPan(dx, dy);
            }

            lastTouchDistance.current = newDistance;
            lastTouchCenter.current = newCenter;
        }
    }, [enabled, onPinch, onPan]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        // Clear long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        // Check for tap (short touch without move)
        if (e.changedTouches.length === 1 && touchStartPos.current) {
            const duration = Date.now() - touchStartTime.current;
            const touch = e.changedTouches[0];
            const dx = Math.abs(touch.clientX - touchStartPos.current.x);
            const dy = Math.abs(touch.clientY - touchStartPos.current.y);

            // Tap if short duration and minimal movement
            if (duration < 300 && dx < 10 && dy < 10 && onTap && !isGesturing.current) {
                onTap(touch.clientX, touch.clientY);
            }
        }

        // Reset if no more touches
        if (e.touches.length === 0) {
            lastTouchDistance.current = null;
            lastTouchCenter.current = null;
            touchStartPos.current = null;
            isGesturing.current = false;
        }
    }, [enabled, onTap]);

    useEffect(() => {
        const element = ref.current;
        if (!element || !enabled) return;

        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [ref, enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);
}

export default useTouchGestures;
