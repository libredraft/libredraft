import { getState } from "../stateManager";
import { Canvas } from "./canvas";

export class CanvasContainer {
  private canvasContainer: HTMLElement | null =
    document.getElementById("canvas-container");
  private canvas: SVGElement = Canvas.getCanvasElement();
  private viewBox: { x: number; y: number; w: number; h: number } | undefined;
  private zoom: number | undefined;
  private isPanning: boolean = false;
  private startPoint: { x: number; y: number } | null = null;

  constructor() {
    this.initializeViewBox();
    this.attachEventListeners();
  }

  private initializeViewBox() {
    const viewBoxArray = this.canvas.getAttribute("viewBox")?.split(" ");
    if (viewBoxArray) {
      this.viewBox = {
        x: parseInt(viewBoxArray[0]),
        y: parseInt(viewBoxArray[1]),
        w: parseInt(viewBoxArray[2]),
        h: parseInt(viewBoxArray[3]),
      };
      this.zoom = this.canvas.clientWidth / this.viewBox.w;
    }
  }

  private attachEventListeners() {
    this.canvasContainer!.addEventListener("mousedown", this.handleMouseDown);
    this.canvasContainer!.addEventListener("mousemove", this.handleMouseMove);
    this.canvasContainer!.addEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseDown = (event: MouseEvent) => {
    this.canvas.style.cursor = "grab";
    if (
      !getState().isDrawing &&
      !getState().isEditing &&
      !getState().isMoving
    ) {
      const viewBoxArray = this.canvas.getAttribute("viewBox")?.split(" ");
      if (viewBoxArray) {
        this.viewBox = {
          x: parseInt(viewBoxArray[0]),
          y: parseInt(viewBoxArray[1]),
          w: parseInt(viewBoxArray[2]),
          h: parseInt(viewBoxArray[3]),
        };
        this.zoom = this.canvas.clientWidth / this.viewBox.w;
      }
      this.isPanning = true;
      this.startPoint = { x: event.offsetX, y: event.offsetY };
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (this.isPanning) {
      this.zoom = this.canvas.clientWidth / this.viewBox!.w;
      const endPoint = { x: event.offsetX, y: event.offsetY };
      const dx = (this.startPoint!.x - endPoint.x) / this.zoom;
      const dy = (this.startPoint!.y - endPoint.y) / this.zoom;
      const movedViewBox = {
        x: this.viewBox!.x + dx,
        y: this.viewBox!.y + dy,
        w: this.viewBox!.w,
        h: this.viewBox!.h,
      };
      this.canvas.setAttribute(
        "viewBox",
        `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`
      );
    }
  };

  private handleMouseUp = (event: MouseEvent) => {
    this.canvas.style.cursor = "crosshair";
    if (this.isPanning) {
      this.isPanning = false;
    }
  };
}
