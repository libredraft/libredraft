import { Circle } from "./circle";
import { Canvas } from "../../canvas";
import { getState, setState } from "../../stateManager";
import { oSnap, toSvgPoint } from "../../utility";
import { Point } from "../point";

export class CircleListener {
  canvas: SVGElement = Canvas.getCanvasElement();

  public attachListenersToCanvas() {
    this.canvas!.addEventListener("mouseup", this.canvasMouseUp);
    this.canvas!.addEventListener("mousemove", this.canvasMouseMove);
    window.addEventListener("keydown", this.windowKeyDown);
  }

  private canvasMouseUp = (event: MouseEvent) => {
    const x = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.x;
    const y = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.y;

    if (getState().startPoint) {
      this.finishDrawing();
    } else {
      setState((state) => ({
        ...state,
        startPoint: new Point(x, y),
      }));

      const circle = new Circle().init();
      setState((state) => ({ ...state, selectedElement: circle }));
    }
  };

  private canvasMouseMove = (event: MouseEvent) => {
    if (!getState().startPoint) {
      this.showPositionBox(event.offsetX, event.offsetY);
    } else {
      let x = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.x;
      let y = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.y;

      setState((state) => ({
        ...state,
        mousePosition: new Point(x, y),
      }));

      if (getState().oSnap) {
        const targetPoint = oSnap(event.offsetX, event.offsetY);
        if (targetPoint) {
          x = targetPoint.x;
          y = targetPoint.y;
        }
      }

      document.getElementById("position-box")!.style.display = "none";

      this.showLengthInput(x, y);

      const r = Math.hypot(
        getState().startPoint!.x - x,
        getState().startPoint!.y - y
      );

      Circle.update(
        getState().selectedElement!,
        getState().startPoint!.x,
        getState().startPoint!.y,
        r
      );
    }
  };

  private windowKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        // Canvas.unSelectAll();
        this.finishDrawing();
        break;
      case "Enter":
        if (!getState().startPoint) {
          const xInput = <HTMLInputElement>document.getElementById("x-input");
          const yInput = <HTMLInputElement>document.getElementById("y-input");
          setState((state) => ({
            ...state,
            startPoint: new Point(
              parseInt(xInput.value),
              parseInt(yInput.value)
            ),
          }));
          const circle = new Circle().init();
          setState((state) => ({ ...state, selectedElement: circle }));
        } else {
          let x = getState().mousePosition!.x;
          let y = getState().mousePosition!.y;
          const lengthBox = <HTMLInputElement>(
            document.getElementById("length-input")
          );
          const length = parseInt(lengthBox.value);
          Circle.update(
            getState().selectedElement!,
            getState().startPoint!.x,
            getState().startPoint!.y,
            length
          );
          this.finishDrawing();
        }
        break;
      default:
        break;
    }
  };

  finishDrawing() {
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

  showPositionBox = (x: number, y: number) => {
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
    const r = Math.hypot(
      getState().startPoint!.x - x,
      getState().startPoint!.y - y
    );
    const length = Math.round(r).toString();
    const lengthBox = <HTMLInputElement>document.getElementById("length-input");
    lengthBox.value = length;
    lengthBox.focus();
    lengthBox.select();
  };

  public attachListenersToCircle(element: SVGElement) {
    element!.addEventListener("mousedown", this.elementMouseUp.bind(this));
  }

  private elementMouseUp(event: MouseEvent) {
    if (getState().startPoint) return null;
    Canvas.unSelectAll();
    const circle = event.currentTarget as SVGCircleElement;
    setState((state) => ({ ...state, selectedElement: circle }));
    const rightMarker = document.getElementById("marker_right_" + circle.id);
    const centerMarker = document.getElementById("marker_center_" + circle.id);
    rightMarker!.setAttribute("visibility", "visible");
    centerMarker!.setAttribute("visibility", "visible");
    document
      .getElementById("remove-button")!
      .addEventListener("click", this.deleteButtonClick);
  }

  deleteButtonClick() {
    document
      .getElementById("remove-button")!
      .removeEventListener("click", this.deleteButtonClick);
    Circle.remove(getState().selectedElement!);
  }
}
