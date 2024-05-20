import { getState, setState } from "../stateManager";

export class EditingPanel {
  private strokeColorButton: HTMLElement | null = document.getElementById(
    "stroke-color-button"
  );
  private strokeColorInput: HTMLElement | null =
    document.getElementById("stroke-color-input");
  private strokeWidthInput: HTMLElement | null =
    document.getElementById("stroke-width-input");
  private strokeWidthButton: HTMLElement | null = document.getElementById(
    "stroke-width-button"
  );
  private strokeWidthValue = document.getElementById("stroke-width-value");
  private fillColorButton: HTMLElement | null =
    document.getElementById("fill-color-button");
  private fillColorInput: HTMLElement | null =
    document.getElementById("fill-color-input");
  private opacityButton: HTMLElement | null =
    document.getElementById("opacity-button");
  private opacityInput: HTMLElement | null =
    document.getElementById("opacity-input");
  private opacityValue: HTMLElement | null =
    document.getElementById("opacity-value");
  private fontSizeButton: HTMLElement | null =
    document.getElementById("font-size-button");
  private fontSizeInput: HTMLElement | null =
    document.getElementById("font-size-input");
  private fontSizeValue: HTMLElement | null =
    document.getElementById("font-size-value");

  constructor() {
    this.attachEventListeners();
  }
  private attachEventListeners() {
    this.strokeColorButton!.addEventListener("click", () =>
      this.strokeColorInput!.click()
    );
    this.strokeColorInput!.addEventListener("input", this.changeStroke);
    this.strokeWidthButton!.addEventListener("click", () => {
      if (this.strokeWidthInput!.style.display === "none") {
        this.strokeWidthInput!.style.display = "inline-block";
      } else {
        this.strokeWidthInput!.style.display = "none";
      }
    });
    this.strokeWidthValue?.addEventListener("click", () =>
      this.strokeWidthButton!.click()
    );
    this.strokeWidthInput!.addEventListener("change", this.changeStrokeWidth);
    this.strokeWidthInput!.addEventListener(
      "focusout",
      () => (this.strokeWidthInput!.style.display = "none")
    );
    this.fillColorButton!.addEventListener("click", () =>
      this.fillColorInput!.click()
    );
    this.fillColorInput!.addEventListener("input", this.changeFillColor);
    this.opacityButton!.addEventListener("click", () => {
      if (this.opacityInput!.style.display === "none") {
        this.opacityInput!.style.display = "inline-block";
      } else {
        this.opacityInput!.style.display = "none";
      }
    });
    this.opacityInput!.addEventListener("change", this.changeOpacity);
    this.opacityInput!.addEventListener(
      "focusout",
      () => (this.opacityInput!.style.display = "none")
    );
    this.opacityValue!.addEventListener("click", () =>
      this.opacityButton!.click()
    );
    this.fontSizeButton!.addEventListener("click", () => {
      if (this.fontSizeInput!.style.display === "none") {
        this.fontSizeInput!.style.display = "inline-block";
      } else {
        this.fontSizeInput!.style.display = "none";
      }
    });

    this.fontSizeInput!.addEventListener("change", this.changeFontSize);
    this.fontSizeInput!.addEventListener(
      "focusout",
      () => (this.fontSizeInput!.style.display = "none")
    );
    this.fontSizeValue!.addEventListener("click", () =>
      this.fontSizeButton!.click()
    );
  }

  private changeStroke(event: any) {
    setState((state) => ({ ...state, stroke: event.target.value }));
    if (getState().selectedElement) {
      getState().selectedElement!.setAttribute("stroke", event.target.value);
    }
  }

  private changeStrokeWidth(event: any) {
    setState((state) => ({
      ...state,
      strokeWidth: parseInt(event.target.value),
    }));
    if (getState().selectedElement) {
      getState().selectedElement!.setAttribute(
        "stroke-width",
        parseInt(event.target.value).toString()
      );
    }
    document.getElementById("stroke-width-value")!.innerText =
      event.target.value;
  }

  private changeFillColor(event: any) {
    setState((state) => ({ ...state, stroke: event.target.value }));
    if (getState().selectedElement) {
      getState().selectedElement!.setAttribute("fill", event.target.value);
    }
  }

  private changeOpacity(event: any) {
    setState((state) => ({
      ...state,
      opacity: parseFloat(event.target.value),
    }));
    if (getState().selectedElement) {
      getState().selectedElement!.setAttribute(
        "opacity",
        parseFloat(event.target.value).toString()
      );
    }
    document.getElementById("opacity-value")!.innerText = event.target.value;
  }

  private changeFontSize(event: any) {
    setState((state) => ({
      ...state,
      fontSize: parseFloat(event.target.value),
    }));
    if (getState().selectedElement) {
      getState().selectedElement!.setAttribute(
        "font-size",
        `${parseFloat(event.target.value)}px`
      );
    }
    document.getElementById("font-size-value")!.innerText = event.target.value;
  }
}
