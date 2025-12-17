export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/**
 * Projection orthogonale d'un point P(px,py) sur un segment [A(x1,y1); B(x2,y2)].
 * Retourne le point projeté borné sur le segment.
 */
export function projectPointOnSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return { x: x1, y: y1 };
  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy))
  );
  return { x: x1 + t * dx, y: y1 + t * dy };
}

/**
 * Contraint le point de fin pour obtenir un segment purement horizontal ou vertical.
 */
export const applyOrthoConstraint = (
  start: { x: number; y: number },
  end: { x: number; y: number }
) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.abs(dx) > Math.abs(dy)
    ? { x: end.x, y: start.y }
    : { x: start.x, y: end.y };
};
