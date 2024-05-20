import { Marker } from "../marker";
import { setState } from "../../stateManager";
import { MarkerListener } from "./markerListener";
import { calculateCenterPoint } from "./utility";
import { Canvas } from "../../canvas";
import { LineListener } from "./lineListener";

export class Line {
  private id: string;
  private stroke: string;
  private strokeWidth: number;
  private opacity: number;
  static canvas: SVGElement = Canvas.getCanvasElement();

  constructor(
    stroke: string = "#FFFFFF",
    strokeWidth: number = 1,
    opacity: number = 1
  ) {
    this.id = crypto.randomUUID();
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.opacity = opacity;
  }

  init(): SVGLineElement {
    const lineElement: SVGLineElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    lineElement.setAttribute("id", this.id);
    lineElement.setAttribute("stroke", this.stroke);
    lineElement.setAttribute("stroke-width", this.strokeWidth.toString());
    lineElement.setAttribute("opacity", this.opacity.toString());
    Line.canvas.appendChild(lineElement);
    new LineListener().attachListenersToLine(lineElement);

    const startMarker = new Marker(`marker_start_${this.id}`, 4, "blue").init();
    new MarkerListener(startMarker);
    const endMarker = new Marker(`marker_end_${this.id}`, 4, "blue").init();
    new MarkerListener(endMarker);
    const centerMarker = new Marker(
      `marker_center_${this.id}`,
      4,
      "green"
    ).init();
    new MarkerListener(centerMarker);

    return lineElement;
  }

  static update(
    lineElement: SVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    lineElement!.setAttribute("x1", x1.toString());
    lineElement!.setAttribute("y1", y1.toString());
    lineElement!.setAttribute("x2", x2.toString());
    lineElement!.setAttribute("y2", y2.toString());

    const startMarker = document.getElementById(
      "marker_start_" + lineElement.id
    );
    const endMarker = document.getElementById("marker_end_" + lineElement.id);

    const centerMarker = document.getElementById(
      "marker_center_" + lineElement.id
    );

    startMarker!.setAttribute("cx", x1.toString());
    startMarker!.setAttribute("cy", y1.toString());

    endMarker!.setAttribute("cx", x2.toString());
    endMarker!.setAttribute("cy", y2.toString());

    const centerPoint = calculateCenterPoint(x1, y1, x2, y2);

    centerMarker!.setAttribute("cx", centerPoint.x.toString());
    centerMarker!.setAttribute("cy", centerPoint.y.toString());

    return lineElement;
  }

  static remove(lineElement: SVGElement) {
    this.canvas.removeChild(lineElement);
    const startMarker = document.getElementById(
      "marker_start_" + lineElement.id
    );
    this.canvas.removeChild(startMarker!);
    const endMarker = document.getElementById("marker_end_" + lineElement.id);
    this.canvas.removeChild(endMarker!);
    const centerMarker = document.getElementById(
      "marker_center_" + lineElement.id
    );
    this.canvas.removeChild(centerMarker!);

    setState((state) => ({ ...state, selectedElement: null }));
  }
}
