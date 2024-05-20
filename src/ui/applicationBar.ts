import { Canvas } from "../canvas";
import { Line } from "../elements";
import { getState, setState } from "../stateManager";

export class ApplicationBar {
  private canvas: SVGElement = Canvas.getCanvasElement();
  private menu: any = document.getElementById("menu");
  private menuButton: any = document.getElementById("menu-button");
  private saveButton: any = document.getElementById("save-button");
  private openButton: any = document.getElementById("open-button");

  constructor() {
    this.attachEventListeners();
  }

  private attachEventListeners() {
    this.menu.addEventListener("focusout", this.menuFocusOut);
    this.menuButton.addEventListener("mouseup", this.menuButtonClick);
    this.openButton.addEventListener("mouseup", this.openButtonClick);
    this.saveButton.addEventListener("mouseup", this.saveButtonClick);
  }

  private menuButtonClick = () => {
    if (this.menu!.style.display == "none") {
      this.menu!.style.display = "block";
      this.menu!.focus();
    } else {
      this.menu!.style.display = "none";
    }
  };

  private menuFocusOut = () => {
    this.menu!.style.display = "none";
  };

  private openButtonClick = () => {
    const openLink = document.createElement("input");
    openLink.type = "file";
    openLink.accept = ".svg";
    openLink.addEventListener("change", this.handleFileLoad);
    openLink.click();
  };

  handleFileLoad(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
      const svgContent = event.target!.result;
      const svgElement: any = document.getElementById("canvas");
      svgElement.innerHTML = svgContent;
    };
  }

  private saveButtonClick = () => {
    const svgData = this.canvas.innerHTML;
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "my-design.svg";
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  };
}
