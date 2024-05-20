import { Text } from "./text";
import { Canvas } from "../../canvas";
import { getState, setState } from "../../stateManager";
import { toSvgPoint } from "../../utility";
import { Point } from "../point";

export class TextListener {
  canvas: SVGElement = Canvas.getCanvasElement();

  public attachListenersToCanvas() {
    this.canvas!.addEventListener("mouseup", this.canvasMouseUp);
    this.canvas!.addEventListener("mousemove", this.canvasMouseMove);
    window.addEventListener("keydown", this.windowKeyDown);
  }

  private canvasMouseUp = (event: MouseEvent) => {
    const x = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.x;
    const y = toSvgPoint(this.canvas, event.offsetX, event.offsetY)!.y;

    if (getState().isDrawing) {
      this.finishDrawing();
    } else {
      setState((state) => ({ ...state, isDrawing: true }));

      setState((state) => ({
        ...state,
        startPoint: new Point(x, y),
      }));

      const text = new Text().init();
      this.showTextInput(x, y);
      document.getElementById("position-box")!.style.display = "none";
      setState((state) => ({ ...state, selectedElement: text }));
    }
  };

  private canvasMouseMove = (event: MouseEvent) => {
    if (!getState().isDrawing) {
      this.showPositionBox(event.offsetX, event.offsetY);
    }
  };

  private windowKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        // Canvas.unSelectAll();
        this.finishDrawing();
        break;
      case "Enter":
        if (!getState().isDrawing) {
          const xInput = <HTMLInputElement>document.getElementById("x-input");
          const yInput = <HTMLInputElement>document.getElementById("y-input");
          setState((state) => ({ ...state, isDrawing: true }));
          setState((state) => ({
            ...state,
            startPoint: new Point(
              parseInt(xInput.value),
              parseInt(yInput.value)
            ),
          }));
          const text = new Text().init();
          setState((state) => ({ ...state, selectedElement: text }));
        } else {
          const textBox = <HTMLInputElement>(
            document.getElementById("text-input")
          );
          const text = textBox.value;
          getState().selectedElement!.textContent = text;

          Text.update(
            getState().selectedElement!,
            getState().startPoint!.x,
            getState().startPoint!.y
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

    const inputBox = document.getElementById("text-box");
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

  showTextInput = (x: number, y: number) => {
    const inputBox = document.getElementById("text-box");
    inputBox!.style.display = "inline";
    document.getElementById("text-box")!.style.left = `${x}px`;
    document.getElementById("text-box")!.style.top = `${y}px`;
    const textBox = <HTMLInputElement>document.getElementById("text-input");
    textBox.focus();
    textBox.select();
  };

  public attachListenersToText(element: SVGElement) {
    element!.addEventListener("mousedown", this.elementMouseUp.bind(this));
  }

  private elementMouseUp(event: MouseEvent) {
    if (getState().isDrawing) return null;
    Canvas.unSelectAll();
    const text = event.currentTarget as SVGElement;
    setState((state) => ({ ...state, selectedElement: text }));
    text.setAttribute("stroke", "blue");
    const centerMarker = document.getElementById("marker_center_" + text.id);
    centerMarker!.setAttribute("visibility", "visible");
    document
      .getElementById("remove-button")!
      .addEventListener("click", this.deleteButtonClick);
  }

  deleteButtonClick() {
    document
      .getElementById("remove-button")!
      .removeEventListener("click", this.deleteButtonClick);
    Text.remove(getState().selectedElement!);
  }
}
