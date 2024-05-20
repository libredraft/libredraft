export function createArc(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  const a = x1 - x2;
  const b = y1 - y2;
  const c = x1 - x3;
  const d = y1 - y3;
  const e = (x1 * x1 - x2 * x2 + (y1 * y1 - y2 * y2)) / 2;
  const f = (x1 * x1 - x3 * x3 + (y1 * y1 - y3 * y3)) / 2;
  const det = b * c - a * d;
  const cx = (b * f - d * e) / det;
  const cy = (c * e - a * f) / det;
  const radius = Math.sqrt((x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy));

  // Calculate the start and end angles of the arc
  const angle1 = Math.atan2(y1 - cy, x1 - cx) * (180 / Math.PI);
  const angle2 = Math.atan2(y3 - cy, x3 - cx) * (180 / Math.PI);

  if (Math.abs(angle2 - angle1) <= 180 && angle2 > angle1) {
    return {
      d: `M ${x1},${y1} A ${radius},${radius} 0 0,1 ${x3},${y3}`,
      cx: cx,
      cy: cy,
    };
  } else {
    return null;
  }
}
