import { getState, setState } from "../stateManager";

export class StatusBar {
  private oSnapButton: HTMLElement;
  private orthoButton: HTMLElement;

  constructor() {
    this.oSnapButton = document.getElementById("o-snap")!;
    this.orthoButton = document.getElementById("ortho")!;
    this.attachEventListeners();
  }

  private attachEventListeners() {
    this.oSnapButton.addEventListener("click", this.handleOSnapClick);
    this.orthoButton.addEventListener("click", this.handleOrthoClick);
  }

  private handleOSnapClick = () => {
    setState((state) => ({ ...state, oSnap: !getState().oSnap }));
    if (getState().oSnap) {
      this.oSnapButton.style.color = "#fff";
      this.oSnapButton.style.fontWeight = "bold";
    } else {
      this.oSnapButton.style.color = "#bbb";
      this.oSnapButton.style.fontWeight = "normal";
    }
  };

  private handleOrthoClick = () => {
    setState((state) => ({ ...state, ortho: !getState().ortho }));
    if (getState().ortho) {
      this.orthoButton.style.color = "#fff";
      this.orthoButton.style.fontWeight = "bold";
    } else {
      this.orthoButton.style.color = "#bbb";
      this.orthoButton.style.fontWeight = "normal";
    }
  };
}
