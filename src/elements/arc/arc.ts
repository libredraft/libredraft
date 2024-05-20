import { setState } from "../../stateManager";
import { Canvas } from "../../canvas";
import { Marker } from "../marker";
import { ArcListener } from "./arcListener";
import { MarkerListener } from "./markerListener";
import { createArc } from "./utility";

export class Arc {
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

  init(): SVGElement {
    const arcElement: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    arcElement.setAttribute("id", this.id);
    arcElement.setAttribute("stroke", this.stroke);
    arcElement.setAttribute("stroke-width", this.strokeWidth.toString());
    arcElement.setAttribute("fill", this.fill);
    arcElement.setAttribute("opacity", this.opacity.toString());
    Arc.canvas.appendChild(arcElement);

    new ArcListener().attachListenersToArc(arcElement);

    const startMarker = new Marker(`marker_start_${this.id}`, 4, "blue").init();
    new MarkerListener(startMarker);
    const midMarker = new Marker(`marker_mid_${this.id}`, 4, "blue").init();
    new MarkerListener(midMarker);
    const endMarker = new Marker(`marker_end_${this.id}`, 4, "blue").init();
    new MarkerListener(endMarker);
    const centerMarker = new Marker(
      `marker_center_${this.id}`,
      4,
      "green"
    ).init();
    new MarkerListener(centerMarker);

    return arcElement;
  }

  static update(
    arcElement: SVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    const arcModel = createArc(x1, y1, x2, y2, x3, y3)!;

    if (arcModel) {
      const d = arcModel.d;
      const cx = arcModel.cx;
      const cy = arcModel.cy;

      arcElement!.setAttribute("d", d);

      const startMarker = document.getElementById(
        "marker_start_" + arcElement.id
      );
      const midMarker = document.getElementById("marker_mid_" + arcElement.id);
      const endMarker = document.getElementById("marker_end_" + arcElement.id);

      startMarker!.setAttribute("cx", x1.toString());
      startMarker!.setAttribute("cy", y1.toString());

      midMarker!.setAttribute("cx", x2.toString());
      midMarker!.setAttribute("cy", y2.toString());

      endMarker!.setAttribute("cx", x3.toString());
      endMarker!.setAttribute("cy", y3.toString());
      const centerMarker = document.getElementById(
        "marker_center_" + arcElement.id
      );
      centerMarker!.setAttribute("cx", cx.toString());
      centerMarker!.setAttribute("cy", cy.toString());
    }
    return arcElement;
  }

  static remove(arcElement: SVGElement) {
    this.canvas.removeChild(arcElement);
    const startMarker = document.getElementById(
      "marker_start_" + arcElement.id
    );
    this.canvas.removeChild(startMarker!);

    const midMarker = document.getElementById("marker_mid_" + arcElement.id);
    this.canvas.removeChild(midMarker!);

    const endMarker = document.getElementById("marker_end_" + arcElement.id);
    this.canvas.removeChild(endMarker!);

    const centerMarker = document.getElementById(
      "marker_center_" + arcElement.id
    );
    this.canvas.removeChild(centerMarker!);

    setState((state) => ({ ...state, selectedElement: null }));
  }
}
