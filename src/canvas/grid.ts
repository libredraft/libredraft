import { Canvas } from "./canvas";

export class Grid {
  canvas: SVGElement = Canvas.getCanvasElement();
  gridElement = document.getElementById("grid");

  constructor() {
    this.drawGrid(10, this.canvas);
  }

  drawGrid(gridSpacing: number, canvasElement: SVGElement) {
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    const gridWidth = width * 2;
    const gridHeight = height * 2;

    let i = 0;
    for (let y = gridHeight / -2; y <= gridHeight * 2; y += gridSpacing) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", (gridWidth / -2).toString());
      line.setAttribute("y1", y.toString());
      line.setAttribute("x2", (gridWidth / 2).toString());
      line.setAttribute("y2", y.toString());
      if (i % 5 === 0) {
        line.setAttribute("stroke", "#454545");
      } else {
        line.setAttribute("stroke", "#282828");
      }

      line.setAttribute("stroke-width", "0.5");
      canvasElement.appendChild(line);
      i++;
    }

    i = 0;
    for (let x = gridWidth / -2; x <= gridWidth * 2; x += gridSpacing) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x.toString());
      line.setAttribute("y1", (gridHeight / -2).toString());
      line.setAttribute("x2", x.toString());
      line.setAttribute("y2", (gridHeight / 2).toString());
      if (i % 5 === 0) {
        line.setAttribute("stroke", "#454545");
      } else {
        line.setAttribute("stroke", "#282828");
      }
      line.setAttribute("stroke-width", "0.5");
      this.gridElement!.appendChild(line);
      i++;
    }
  }
}
