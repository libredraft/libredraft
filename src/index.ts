import { Canvas, CanvasContainer } from "./canvas";
import { DrawingPanel, EditingPanel, StatusBar } from "./ui";
import { ApplicationBar } from "./ui/applicationBar";

const canvasElement = Canvas.getCanvasElement();
new ApplicationBar();
new DrawingPanel(canvasElement);
new EditingPanel();
new CanvasContainer();
new Canvas();
new StatusBar();
