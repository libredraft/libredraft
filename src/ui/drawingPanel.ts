import { ArcListener } from "../elements/arc/arcListener";
import { CircleListener } from "../elements/circle/circleListener";
import { LineListener } from "../elements/line/lineListener";
import { RectangleListener } from "../elements/rectangle/rectangleListener";
import { TextListener } from "../elements/text/textListener";
import { setState } from "../stateManager";

export class DrawingPanel {
  constructor(canvas: SVGElement) {
    document.getElementById("line-button")!.addEventListener("click", () => {
      new LineListener().attachListenersToCanvas();
    });
    document
      .getElementById("rectangle-button")!
      .addEventListener("click", () => {
        new RectangleListener().attachListenersToCanvas();
      });
    document.getElementById("circle-button")!.addEventListener("click", () => {
      new CircleListener().attachListenersToCanvas();
    });
    document.getElementById("arc-button")!.addEventListener("click", () => {
      new ArcListener().attachListenersToCanvas();
    });
    document.getElementById("text-button")!.addEventListener("click", () => {
      new TextListener().attachListenersToCanvas();
    });
  }
}
