import { setState } from "../stateManager";
import { Grid } from "./grid";

export class Canvas {
  private canvasElement = Canvas.getCanvasElement();

  constructor() {
    // new Grid();
    this.initializeViewBox();
    this.attachEventListeners();
  }

  static getCanvasElement(): SVGElement {
    const canvasElement = document.getElementById("canvas");
    if (canvasElement && canvasElement instanceof SVGElement) {
      return canvasElement;
    } else {
      throw new Error("Canvas element not found or is not an SVGElement");
    }
  }

  private initializeViewBox() {
    this.canvasElement.setAttribute(
      "viewBox",
      `0 0 ${this.canvasElement.clientWidth} ${this.canvasElement.clientHeight}`
    );
  }

  private attachEventListeners() {
    this.canvasElement.addEventListener("mousemove", this.handleMouseMove);
    this.canvasElement.addEventListener("wheel", this.handleMouseWheel);
  }

  private handleMouseMove = (event: MouseEvent) => {
    document.getElementById(
      "coordinates"
    )!.textContent = `${event.offsetX}, ${event.offsetY}`;
  };

  private handleMouseWheel = (event: WheelEvent) => {
    event.preventDefault();

    let viewBox = this.canvasElement.getAttribute("viewBox")!.split(" ");

    const { deltaY } = event;
    const zoomFactor = 0.05;

    const zoomDeltaX = parseInt(viewBox[2]) * Math.sign(deltaY) * zoomFactor;
    const zoomDeltaY = parseInt(viewBox[3]) * Math.sign(deltaY) * zoomFactor;

    const zoomCenterX = event.offsetX / this.canvasElement.clientWidth;
    const zoomCenterY = event.offsetY / this.canvasElement.clientHeight;

    viewBox = [
      (parseInt(viewBox[0]) + zoomDeltaX * zoomCenterX).toString(),
      (parseInt(viewBox[1]) + zoomDeltaY * zoomCenterY).toString(),
      (parseInt(viewBox[2]) - zoomDeltaX).toString(),
      (parseInt(viewBox[3]) - zoomDeltaY).toString(),
    ];

    const zoom = this.canvasElement.clientWidth / parseInt(viewBox[2]);
    document.getElementById("zoom-value")!.innerText = `${Math.round(
      zoom * 100
    )}%`;
    if (zoom > 0.2 && zoom < 4) {
      this.canvasElement.setAttribute(
        "viewBox",
        `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`
      );
    }
    setState((state) => ({ ...state, zoom: zoom }));
  };

  static unSelectAll() {
    const canvasElement = new Canvas().canvasElement;

    setState((state) => ({ ...state, selectedElement: null }));

    const elements = canvasElement.querySelectorAll("*");

    for (const element of elements) {
      if (element.getAttribute("stroke") === "blue") {
        element.setAttribute("stroke", "white");
      }
      if (element.id && element.id.includes("marker")) {
        element!.setAttribute("visibility", "hidden");
      }
    }
  }
}
