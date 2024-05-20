import { Line } from "./line";
import { Canvas } from "../../canvas";
import { getState, setState } from "../../stateManager";
import { oSnap, toSvgPoint } from "../../utility";
import { Point } from "../point";
import { lineLength, calculateEndpoint } from "./utility";

export class LineListener {
  canvas: SVGElement;

  constructor(canvas: SVGElement) {
    this.canvas = canvas;
  }

  public attachListenersToCanvas() {
    this.canvas!.addEventListener("mouseup", this.canvasMouseUp);
    this.canvas!.addEventListener("mousemove", this.canvasMouseMove);
    window.addEventListener("keydown", this.windowKeyDown);
  }

  private canvasMouseUp = (event: MouseEvent) => {
    const x = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.x;
    const y = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.y;
    setState((state) => ({ ...state, isDrawing: true }));

    if (getState().isDrawing) {
      // this.finalizeLine();
      setState((state) => ({
        ...state,
        startPoint: new Point(x, y),
      }));
    }

    setState((state) => ({
      ...state,
      startPoint: new Point(x, y),
    }));
    const lineObject = new Line("white", 2);
    const line = lineObject.init();
    setState((state) => ({ ...state, selectedElement: line! }));
  };

  private canvasMouseMove = (event: MouseEvent) => {
    let x = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.x;
    let y = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.y;
    setState((state) => ({
      ...state,
      mousePosition: new Point(x, y),
    }));
    this.showCoordinateBox(x, y);
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
    } else if (getState().isDrawing) {
      this.showLengthInput(x, y);
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
      Line.update(
        getState().selectedElement!,
        getState().startPoint!.x,
        getState().startPoint!.y,
        x,
        y
      );
    }
  };

  private windowKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        Canvas.unSelectAll();
        this.finalizeLine();
        break;
      case "Enter":
        if (!getState().isDrawing) {
          const xInput = <HTMLInputElement>document.getElementById("x-input");
          const yInput = <HTMLInputElement>document.getElementById("y-input");
          setState((state) => ({
            ...state,
            startPoint: new Point(
              parseInt(xInput.value),
              parseInt(yInput.value)
            ),
          }));
          setState((state) => ({ ...state, isDrawing: true }));
          const lineObject = new Line();
          const line = lineObject.init();
          setState((state) => ({ ...state, selectedElement: line! }));
        } else {
          const lengthBox = <HTMLInputElement>(
            document.getElementById("length-input")
          );
          const length = parseInt(lengthBox.value);
          const endpoint = calculateEndpoint(
            getState().startPoint!,
            length,
            getState().mousePosition!
          );
          Line.update(
            getState().selectedElement!,
            getState().startPoint!.x,
            getState().startPoint!.y,
            endpoint.x,
            endpoint.y
          );
          this.finalizeLine();
        }
        break;
      default:
        break;
    }
  };

  showCoordinateBox = (x: number, y: number) => {
    const positionBox = document.getElementById("position-box");
    positionBox!.style.display = "inline";
    document.getElementById("position-box")!.style.left = `${x + 10}px`;
    document.getElementById("position-box")!.style.top = `${y + 10}px`;
    const xInput = <HTMLInputElement>document.getElementById("x-input");
    const yInput = <HTMLInputElement>document.getElementById("y-input");
    xInput.focus();
    xInput.select();
    xInput.value = x.toString();
    yInput.value = y.toString();
  };

  showLengthInput = (x: number, y: number) => {
    const inputBox = document.getElementById("length-box");
    inputBox!.style.display = "inline";
    const centerPoint = new Point(
      (x + getState().startPoint!.x) / 2,
      (y + getState().startPoint!.y) / 2
    );
    document.getElementById("length-box")!.style.left = `${
      centerPoint.x + 10
    }px`;
    document.getElementById("length-box")!.style.top = `${
      centerPoint.y + 10
    }px`;
    const length = lineLength(
      getState().startPoint!.x,
      getState().startPoint!.y,
      x,
      y
    ).toString();
    const lengthBox = <HTMLInputElement>document.getElementById("length-input");
    lengthBox.value = length;
    lengthBox.focus();
    lengthBox.select();
  };

  finalizeLine() {
    setState((state) => ({ ...state, selectedElement: null }));
    setState((state) => ({ ...state, startPoint: null }));
    setState((state) => ({ ...state, isDrawing: false }));
    const positionBox = document.getElementById("position-box");
    positionBox!.style.display = "none";
    const inputBox = document.getElementById("length-box");
    inputBox!.style.display = "none";
    this.canvas!.removeEventListener("mouseup", this.canvasMouseUp);
    this.canvas!.removeEventListener("mousemove", this.canvasMouseMove);
    window.removeEventListener("keydown", this.windowKeyDown);
  }

  public attachListenersToLine(element: SVGElement) {
    element!.addEventListener("mousedown", this.elementMouseUp.bind(this));
  }

  private elementMouseUp(event: MouseEvent) {
    // Canvas.unSelectAll();
    const line = event.currentTarget as SVGLineElement;
    setState((state) => ({ ...state, selectedElement: line }));
    line.setAttribute("stroke", "blue");
    const startMarker = document.getElementById("marker_start_" + line.id);
    const endMarker = document.getElementById("marker_end_" + line.id);
    // const centerMarker = document.getElementById("marker_center_" + line.id);
    startMarker!.setAttribute("visibility", "visible");
    endMarker!.setAttribute("visibility", "visible");
    // centerMarker!.setAttribute("visibility", "visible");
  }
}
