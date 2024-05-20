import { Canvas } from "../../canvas";
import { getState, setState } from "../../stateManager";
import { oSnap, toSvgPoint } from "../../utility";
import { Point } from "../point";
import { Line } from "./line";

export class MarkerListener {
  canvas: SVGElement = Canvas.getCanvasElement();
  marker: SVGElement;

  constructor(marker: SVGElement) {
    this.marker = marker;
    this.attachListenersToMarker();
  }

  public attachListenersToMarker = () => {
    this.marker.addEventListener("mousedown", this.markerMouseDown);
    this.marker.addEventListener("mouseup", this.markerMouseUp);
  };

  private markerMouseDown = (event: MouseEvent) => {
    setState((state) => ({ ...state, isEditing: true }));
    const marker = event.currentTarget as SVGLineElement;
    const parentElement: any = document.getElementById(marker.id.split("_")[2]);
    let x1 = parentElement!.getAttribute("x1");
    let y1 = parentElement!.getAttribute("y1");
    let x2 = parentElement!.getAttribute("x2");
    let y2 = parentElement!.getAttribute("y2");
    let cx = marker.getAttribute("cx");
    let cy = marker.getAttribute("cy");
    const markerType = marker.id.split("_")[1];
    if (markerType === "center") {
      setState((state) => ({ ...state, isMoving: true }));
    } else {
      if (cx === x1 && cy === y1) {
        setState((state) => ({
          ...state,
          startPoint: new Point(parseInt(x2!), parseInt(y2!)),
        }));
      } else {
        setState((state) => ({
          ...state,
          startPoint: new Point(parseInt(x1!), parseInt(y1!)),
        }));
      }
      setState((state) => ({ ...state, selectedElement: parentElement }));
    }
    this.canvas.addEventListener("mousemove", this.canvasMouseMove);
  };

  private canvasMouseMove = (event: MouseEvent) => {
    if (getState().isMoving) {
      const deltaX = event.movementX;
      const deltaY = event.movementY;
      const parentElement = getState().selectedElement;
      let x1 = parseInt(parentElement!.getAttribute("x1")!);
      let y1 = parseInt(parentElement!.getAttribute("y1")!);
      let x2 = parseInt(parentElement!.getAttribute("x2")!);
      let y2 = parseInt(parentElement!.getAttribute("y2")!);
      Line.update(
        parentElement!,
        x1 + deltaX,
        y1 + deltaY,
        x2 + deltaX,
        y2 + deltaY
      );
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
      if (getState().startPoint) {
        Line.update(
          getState().selectedElement!,
          getState().startPoint!.x,
          getState().startPoint!.y,
          x,
          y
        );
      }
    }
  };

  private markerMouseUp = () => {
    if (getState().isEditing) {
      setState((state) => ({ ...state, isMoving: false }));
      setState((state) => ({ ...state, startPoint: null }));
      setState((state) => ({ ...state, isEditing: false }));
      const canvas = document.getElementById("canvas");
      canvas!.removeEventListener("mousemove", this.canvasMouseMove);
    }
  };
}
