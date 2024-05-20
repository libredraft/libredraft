import { Canvas } from "../../canvas";
import { getState, setState } from "../../stateManager";
import { oSnap, toSvgPoint } from "../../utility";
import { Text } from "./text";

export class MarkerListener {
  private canvas: SVGElement = Canvas.getCanvasElement();
  private marker: SVGElement;

  constructor(marker: SVGElement) {
    this.marker = marker;
    this.attachListenersToMarker();
  }

  public attachListenersToMarker = () => {
    this.marker.addEventListener("mousedown", this.markerMouseDown);
  };

  private markerMouseDown = (event: MouseEvent) => {
    setState((state) => ({ ...state, isEditing: true }));
    const marker = event.currentTarget as SVGCircleElement;
    const markerType = marker.id.split("_")[1];
    if (markerType === "center") {
      setState((state) => ({ ...state, isMoving: true }));
    }
    this.canvas.addEventListener("mousemove", this.canvasMouseMove);
  };

  private canvasMouseMove = (event: MouseEvent) => {
    const parentElement = getState().selectedElement;
    let startX = parseInt(parentElement!.getAttribute("x")!);
    let startY = parseInt(parentElement!.getAttribute("y")!);
    let width = parseInt(parentElement!.getAttribute("width")!);
    let height = parseInt(parentElement!.getAttribute("height")!);
    if (getState().isMoving) {
      const deltaX = event.movementX;
      const deltaY = event.movementY;

      Text.update(parentElement!, startX + deltaX, startY + deltaY);
    } else {
      let x = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.x;
      let y = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.y;
      if (getState().ortho) {
        if (
          Math.abs(event.offsetX - getState().startPoint!.x) <
          Math.abs(event.offsetY - getState().startPoint!.y)
        ) {
          x = getState().startPoint!.x;
        } else {
          y = getState().startPoint!.y;
        }
      }
      if (getState().oSnap) {
        const targetPoint = oSnap(event.offsetX, event.offsetY);
        if (targetPoint) {
          x = targetPoint.x;
          y = targetPoint.y;
        }
      }
      const width = Math.abs(startX - x);
      const height = Math.abs(startY - y);
      Text.update(getState().selectedElement!, startX, startY);
    }
    this.canvas.addEventListener("mouseup", this.markerMouseUp);
  };

  private markerMouseUp = () => {
    if (getState().isEditing) {
      setState((state) => ({ ...state, isMoving: false }));
      setState((state) => ({ ...state, startPoint: null }));
      setState((state) => ({ ...state, isEditing: false }));
      this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
      this.canvas.removeEventListener("mouseup", this.markerMouseUp);
    }
  };
}
