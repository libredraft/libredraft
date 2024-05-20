import { Canvas } from "../../canvas";
import { getState, setState } from "../../stateManager";
import { oSnap, toSvgPoint } from "../../utility";
import { Arc } from "./arc";

export class MarkerListener {
  private canvas: SVGElement = Canvas.getCanvasElement();
  private marker: SVGElement;
  private selectedMarker: string | null = null;

  constructor(marker: SVGElement) {
    this.marker = marker;
    this.attachListenersToMarker();
  }

  public attachListenersToMarker = () => {
    this.marker.addEventListener("mousedown", this.markerMouseDown);
  };

  private markerMouseDown = (event: MouseEvent) => {
    setState((state) => ({ ...state, isEditing: true }));
    const marker = event.currentTarget as SVGElement;
    const markerType = marker.id.split("_")[1];
    if (markerType === "center") {
      setState((state) => ({ ...state, isMoving: true }));
    }
    if (markerType === "start") {
      this.selectedMarker = "start";
    } else if (markerType === "mid") {
      this.selectedMarker = "mid";
    } else {
      this.selectedMarker = "end";
    }
    this.canvas.addEventListener("mousemove", this.canvasMouseMove);
  };

  private canvasMouseMove = (event: MouseEvent) => {
    const arcElement = getState().selectedElement;
    const startMarker = document.getElementById(
      "marker_start_" + arcElement!.id
    );
    const midMarker = document.getElementById("marker_mid_" + arcElement!.id);
    const endMarker = document.getElementById("marker_end_" + arcElement!.id);
    const x1 = parseInt(startMarker!.getAttribute("cx")!);
    const y1 = parseInt(startMarker!.getAttribute("cy")!);
    const x2 = parseInt(midMarker!.getAttribute("cx")!);
    const y2 = parseInt(midMarker!.getAttribute("cy")!);
    const x3 = parseInt(endMarker!.getAttribute("cx")!);
    const y3 = parseInt(endMarker!.getAttribute("cy")!);
    if (getState().isMoving) {
      const deltaX = event.movementX;
      const deltaY = event.movementY;

      Arc.update(
        arcElement!,
        x1 + deltaX,
        y1 + deltaY,
        x2 + deltaX,
        y2 + deltaY,
        x3 + deltaX,
        y3 + deltaY
      );
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
      if (this.selectedMarker === "start") {
        Arc.update(getState().selectedElement!, x, y, x2, y2, x3, y3);
      } else if (this.selectedMarker === "mid") {
        Arc.update(getState().selectedElement!, x1, y1, x, y, x3, y3);
      } else if (this.selectedMarker === "end") {
        Arc.update(getState().selectedElement!, x1, y1, x2, y2, x, y);
      }
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
