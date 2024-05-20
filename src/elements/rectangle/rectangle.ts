import { setState } from "../../stateManager";
import { Canvas } from "../../canvas";
import { Marker } from "../marker";
import { RectangleListener } from "./rectangleListener";
import { MarkerListener } from "./markerListener";

export class Rectangle {
  private id: string;
  private stroke: string;
  private strokeWidth: number;
  private fill: string;
  private opacity: number;
  static canvas: SVGElement = Canvas.getCanvasElement();

  constructor(
    stroke: string = "#FFFFFF",
    strokeWidth: number = 1,
    fill: string = "transparent",
    opacity: number = 1
  ) {
    this.id = crypto.randomUUID();
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.fill = fill;
    this.opacity = opacity;
  }

  init(): SVGRectElement {
    const rectangleElement: any = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rectangleElement.setAttribute("id", this.id);
    rectangleElement.setAttribute("stroke", this.stroke);
    rectangleElement.setAttribute("stroke-width", this.strokeWidth.toString());
    rectangleElement.setAttribute("fill", this.fill);
    rectangleElement.setAttribute("opacity", this.opacity.toString());
    Rectangle.canvas.appendChild(rectangleElement);

    new RectangleListener().attachListenersToRectangle(rectangleElement);

    const rightMarker = new Marker(`marker_right_${this.id}`, 4, "blue").init();
    new MarkerListener(rightMarker);
    const centerMarker = new Marker(
      `marker_center_${this.id}`,
      4,
      "green"
    ).init();
    new MarkerListener(centerMarker);

    return rectangleElement;
  }

  static update(
    rectangleElement: SVGElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    rectangleElement!.setAttribute("x", x.toString());
    rectangleElement!.setAttribute("y", y.toString());
    rectangleElement!.setAttribute("width", width.toString());
    rectangleElement!.setAttribute("height", height.toString());

    const rightMarker = document.getElementById(
      "marker_right_" + rectangleElement.id
    );

    const centerMarker = document.getElementById(
      "marker_center_" + rectangleElement.id
    );

    rightMarker!.setAttribute("cx", (x + width).toString());
    rightMarker!.setAttribute("cy", (y + height).toString());

    centerMarker!.setAttribute("cx", x.toString());
    centerMarker!.setAttribute("cy", y.toString());

    return rectangleElement;
  }

  static remove(rectangleElement: SVGElement) {
    this.canvas.removeChild(rectangleElement);
    const rightMarker = document.getElementById(
      "marker_right_" + rectangleElement.id
    );
    this.canvas.removeChild(rightMarker!);
    const centerMarker = document.getElementById(
      "marker_center_" + rectangleElement.id
    );
    this.canvas.removeChild(centerMarker!);

    setState((state) => ({ ...state, selectedElement: null }));
  }
}
