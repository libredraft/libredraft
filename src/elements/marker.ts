import { Canvas } from "../canvas";

export class Marker {
  private canvas: SVGElement = Canvas.getCanvasElement();
  private id: string;
  private radius: number;
  private fill: string;

  constructor(id: string, radius: number = 4, fill: string = "#00E1FF") {
    this.id = id;
    this.radius = radius;
    this.fill = fill;
  }

  init() {
    const marker: SVGCircleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    marker.setAttribute("id", this.id);
    marker.setAttribute("r", this.radius.toString());
    marker.setAttribute("stroke", "none");
    marker.setAttribute("fill", this.fill);
    marker.setAttribute("visibility", "hidden");

    this.canvas.appendChild(marker);

    return marker;
  }
}
