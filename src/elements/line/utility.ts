import { Point } from "../point";

export function lineLength(x1: number, y1: number, x2: number, y2: number) {
  return Math.round(Math.hypot(x2 - x1, y2 - y1));
}

export const calculateEndpoint = (
  startPoint: Point,
  length: number,
  mousePosition: Point
): Point => {
  // Calculate the difference between the mouse position and the start point
  const dx = mousePosition.x - startPoint.x;
  const dy = mousePosition.y - startPoint.y;

  // Calculate the angle of the line using arctangent
  const angle = Math.atan2(dy, dx);

  // Calculate the new x and y coordinates of the endpoint using trigonometry
  const endX = startPoint.x + length * Math.cos(angle);
  const endY = startPoint.y + length * Math.sin(angle);

  return new Point(Math.round(endX), Math.round(endY));
};

export const calculateCenterPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return new Point((x1 + x2) / 2, (y1 + y2) / 2);
};
