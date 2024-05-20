import { setState } from "../../stateManager";
import { Canvas } from "../../canvas";
import { Marker } from "../marker";
import { TextListener } from "./textListener";
import { MarkerListener } from "./markerListener";

export class Text {
  private id: string;
  private fontSize: number;
  private fill: string;
  private stroke: string;
  private strokeWidth: number;
  static canvas: SVGElement = Canvas.getCanvasElement();

  constructor(
    fontSize: number = 24,
    fill: string = "white",
    stroke: string = "blue",
    strokeWidth: number = 0
  ) {
    this.id = crypto.randomUUID();
    this.fontSize = fontSize;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
  }

  init(): SVGRectElement {
    const textElement: any = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textElement.setAttribute("id", this.id);
    textElement.setAttribute("font-size", this.fontSize.toString());
    textElement.setAttribute("fill", this.fill);
    textElement.setAttribute("stroke", this.stroke);
    textElement.setAttribute("stroke-width", this.strokeWidth.toString());
    Text.canvas.appendChild(textElement);
    new TextListener().attachListenersToText(textElement);

    const centerMarker = new Marker(
      `marker_center_${this.id}`,
      4,
      "green"
    ).init();
    new MarkerListener(centerMarker);

    return textElement;
  }

  static update(textElement: SVGElement, x: number, y: number) {
    textElement!.setAttribute("x", x.toString());
    textElement!.setAttribute("y", y.toString());

    const centerMarker = document.getElementById(
      "marker_center_" + textElement.id
    );

    centerMarker!.setAttribute("cx", (x - 5).toString());
    centerMarker!.setAttribute("cy", (y + 5).toString());

    return textElement;
  }

  static remove(textElement: SVGElement) {
    this.canvas.removeChild(textElement);
    const centerMarker = document.getElementById(
      "marker_center_" + textElement.id
    );
    this.canvas.removeChild(centerMarker!);

    setState((state) => ({ ...state, selectedElement: null }));
  }
}
