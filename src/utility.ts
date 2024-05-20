export function toWcs(svg: SVGElement, x: number, y: number) {
  const height = svg.getBoundingClientRect().height;

  if (height) {
    y = Math.round(height - y);
  }

  return {
    x: x,
    y: y,
  };
}

export function toSvgPoint(svg: any, x: number, y: number) {
  const point = svg.createSVGPoint();
  point.x = x;
  point.y = y;
  const transferPoint = point.matrixTransform(svg!.getScreenCTM()!.inverse());
  return { x: parseInt(transferPoint.x), y: parseInt(transferPoint.y) };
}

export function oSnap(x: number, y: number) {
  let minDist = 100000;
  let targetPoint = { x: x, y: y };
  let elements = document.querySelectorAll("body *");

  elements.forEach(function (element) {
    if (element.tagName === "line") {
      const x1 = parseInt(element.getAttribute("x1")!);
      const y1 = parseInt(element.getAttribute("y1")!);
      const x2 = parseInt(element.getAttribute("x2")!);
      const y2 = parseInt(element.getAttribute("y2")!);

      let distFromStart = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
      if (distFromStart < minDist) {
        minDist = distFromStart;
        targetPoint = { x: x1, y: y1 };
      }
      let distFromEnd = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
      if (distFromEnd < minDist) {
        minDist = distFromEnd;
        targetPoint = { x: x2, y: y2 };
      }
    }
  });
  return targetPoint;
}
