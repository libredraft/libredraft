import { setState } from "../../stateManager";
import { Canvas } from "../../canvas";
import { Marker } from "../marker";
import { CircleListener } from "./circleListener";
import { MarkerListener } from "./markerListener";

export class Circle {
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

  init(): SVGCircleElement {
    const circleElement: SVGCircleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleElement.setAttribute("id", this.id);
    circleElement.setAttribute("stroke", this.stroke);
    circleElement.setAttribute("stroke-width", this.strokeWidth.toString());
    circleElement.setAttribute("fill", this.fill);
    circleElement.setAttribute("opacity", this.opacity.toString());
    Circle.canvas.appendChild(circleElement);

    new CircleListener().attachListenersToCircle(circleElement);

    const rightMarker = new Marker(`marker_right_${this.id}`, 4, "blue").init();
    new MarkerListener(rightMarker);

    const centerMarker = new Marker(
      `marker_center_${this.id}`,
      4,
      "green"
    ).init();
    new MarkerListener(centerMarker);

    return circleElement;
  }

  static update(circleElement: SVGElement, cx: number, cy: number, r: number) {
    circleElement!.setAttribute("cx", cx.toString());
    circleElement!.setAttribute("cy", cy.toString());
    circleElement!.setAttribute("r", r.toString());

    const rightMarker = document.getElementById(
      "marker_right_" + circleElement.id
    );

    const centerMarker = document.getElementById(
      "marker_center_" + circleElement.id
    );

    rightMarker!.setAttribute("cx", (cx + r).toString());
    rightMarker!.setAttribute("cy", cy.toString());

    centerMarker!.setAttribute("cx", cx.toString());
    centerMarker!.setAttribute("cy", cy.toString());

    return circleElement;
  }

  static remove(circleElement: SVGElement) {
    this.canvas.removeChild(circleElement);
    const rightMarker = document.getElementById(
      "marker_right_" + circleElement.id
    );
    this.canvas.removeChild(rightMarker!);

    const centerMarker = document.getElementById(
      "marker_center_" + circleElement.id
    );
    this.canvas.removeChild(centerMarker!);

    setState((state) => ({ ...state, selectedElement: null }));
  }
}
