import { Point } from "./elements";

interface AppState {
  oSnap: boolean;
  ortho: boolean;
  selectedElement: SVGElement | null;
  selectedDrawing: string | null;
  selectedAction: string | null;
  isDrawing: boolean;
  isEditing: boolean;
  isMoving: boolean;
  startPoint: Point | null;
  secondPoint: Point | null;
  mousePosition: Point | null;
  zoom: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
  opacity: number;
  fontSize: number;
}

let initialState: AppState = {
  oSnap: false,
  ortho: false,
  selectedElement: null,
  selectedDrawing: null,
  selectedAction: null,
  isDrawing: false,
  isEditing: false,
  isMoving: false,
  startPoint: null,
  secondPoint: null,
  mousePosition: null,
  zoom: 1,
  stroke: "white",
  strokeWidth: 1,
  fill: "transparent",
  opacity: 1,
  fontSize: 14,
};

let subscribers: ((state: AppState) => void)[] = [];

function getState(): AppState {
  return initialState;
}

function setState(newState: AppState | ((prevState: AppState) => AppState)) {
  const nextState =
    typeof newState === "function" ? newState(initialState) : newState;
  initialState = nextState;
  notifySubscribers();
}

function subscribe(callback: (state: AppState) => void) {
  subscribers.push(callback);
}

function notifySubscribers() {
  subscribers.forEach((callback) => callback(initialState));
}

export { getState, setState, subscribe };
