import EventBus from "./EventBus";
import Camera from "./Camera";
import RenderEngine from "./RenderEngine";

/**
 * Used for moving pedigees on mouse click or panning the diagram.
 * 
 * DragHandler is alse emiting many events, accesible for developers, 
 * after resolving user intentions.
 */

export default class DragHandler {
  diagram: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  mouseOffsetX = 0;
  mouseOffsetY = 0;

  firstCursorX = 0;
  firstCursorY = 0;
  deltaX = 0;
  deltaY = 0;
  initialCameraOffsetX = 0;
  initialCameraOffsetY = 0;

  panDiagram = false;
  renderEngine: RenderEngine;

  dragEnabled = false
  panEnabled = false

  constructor(diagram, renderEngine) {
    this.diagram = diagram;
    this.ctx = diagram.getContext("2d");
    this.renderEngine = renderEngine;
    this.initEvents();
  }

  private initEvents(): void {
    this.diagram.onmousedown = (e) => {
      this.setUserIntention(e);
    };
    this.diagram.onmousemove = (e) => {
      this.drag(e);
    };
    this.diagram.onmouseup = (e) => {
      this.stopDrag();
    };
  }

  private setUserIntention(e: MouseEvent): void {
    const rect = this.diagram.getBoundingClientRect();
    const scale = this.ctx.getTransform().a;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.panDiagram = true;
    let wasPedigreeClicked = false
    this.renderEngine.pedigrees.forEach((pedigree) => {
      pedigree.initShape();
      if (this.ctx.isPointInPath(mouseX, mouseY)) {
        pedigree.dragEnabled = true;
        this.mouseOffsetX = mouseX / scale - pedigree.x;
        this.mouseOffsetY = mouseY / scale - pedigree.y;
        this.panDiagram = false;
        EventBus.emit(`pedigree-click`, pedigree);
        wasPedigreeClicked = true
      }
    });

    if (this.panDiagram) {
      this.firstCursorX = e.clientX;
      this.firstCursorY = e.clientY;
    }

    if(!wasPedigreeClicked) {
      EventBus.emit("diagram-click");
    }

    EventBus.emit("redraw")
  }

  private drag(e: MouseEvent): void {
    if (this.panDiagram) {
      this.dragDiagram(e);
    } else {
      this.dragPedigree(e);
    }
  }

  private dragDiagram(e: MouseEvent): void {
    if(!this.panEnabled) return;
    const scale = this.ctx.getTransform().a;
    this.deltaX = (e.clientX - this.firstCursorX) / scale;
    this.deltaY = (e.clientY - this.firstCursorY) / scale;
    Camera.OffsetX = this.initialCameraOffsetX + this.deltaX;
    Camera.OffsetY = this.initialCameraOffsetY + this.deltaY;
    EventBus.emit("diagram-click");
    EventBus.emit("redraw");
  }

  private dragPedigree(e: MouseEvent): void {
    if(!this.dragEnabled) return;
    const rect = this.diagram.getBoundingClientRect();
    const scale = this.ctx.getTransform().a;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    for (let i = 0; i < this.renderEngine.pedigrees.length; i++) {
      const pedigree = this.renderEngine.pedigrees[i];
      if (pedigree.isInLegend) {
        continue;
      }
      if (pedigree.dragEnabled) {
        pedigree.x = Math.round((mouseX / scale - this.mouseOffsetX) / 15) * 15;
        pedigree.y = Math.round((mouseY / scale - this.mouseOffsetY) / 15) * 15;
        EventBus.emit("pedigree-drag", pedigree);
        if (pedigree.twin) {
          pedigree.twin.y =
            Math.round((mouseY / scale - this.mouseOffsetY) / 15) * 15;
        }
        break;
      }
    }
    EventBus.emit("redraw");
  }

  private stopDrag(): void {
    if (this.panDiagram) {
      this.initialCameraOffsetX = Camera.OffsetX;
      this.initialCameraOffsetY = Camera.OffsetY;
      this.panDiagram = false;
    }
    this.renderEngine.pedigrees.forEach((pedigree) => {
      pedigree.dragEnabled = false;
    });
  }
}
