import { Canvas } from "../../canvas";
import { getState, setState } from "../../stateManager";
import { oSnap, toSvgPoint } from "../../utility";
import { Circle } from "./circle";

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
    let cx = parseInt(parentElement!.getAttribute("cx")!);
    let cy = parseInt(parentElement!.getAttribute("cy")!);
    let r = parseInt(parentElement!.getAttribute("r")!);
    if (getState().isMoving) {
      const deltaX = event.movementX;
      const deltaY = event.movementY;

      Circle.update(parentElement!, cx + deltaX, cy + deltaY, r);
    } else {
      let x = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.x;
      let y = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.y;
      if (getState().oSnap) {
        const targetPoint = oSnap(event.offsetX, event.offsetY);
        if (targetPoint) {
          x = targetPoint.x;
          y = targetPoint.y;
        }
      }
      const r = Math.hypot(cx - x, cy - y);
      Circle.update(getState().selectedElement!, cx, cy, r);
    }
    this.canvas.addEventListener("mouseup", this.markerMouseUp);
  };

  private markerMouseUp = () => {
    if (getState().isEditing) {
      setState((state) => ({ ...state, isMoving: false }));
      setState((state) => ({ ...state, isEditing: false }));
      this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
      this.canvas.removeEventListener("mouseup", this.markerMouseUp);
    }
  };
}
