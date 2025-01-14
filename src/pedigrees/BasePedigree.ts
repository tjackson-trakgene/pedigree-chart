import EventBus from "../EventBus";
import Label from "./Label";
import Shape from "../diseaseShapes/Shape";
import camera from "../Camera";
import IdGenerator from "../IdGenerator";

interface ShapeProps {
  shapeInstance: Shape;
  diseaseShape: string;
  diseaseColor: string;
}

/**
 * Basic class from other pedigree classes are inheriting
 * 
 * It has its own config and common methods for all classes.
 * There are abstract methods.
 * 
 * For example, every sex have different shape, so commands for drawing those shapes are unique 
 * for each one. No matter of sex, every pedigree acts the same thanks to the BasePedigree
 */


export default abstract class BasePedigree {
  protected label: Label;
  protected shapes: ShapeProps[] = [];
  protected ctx: CanvasRenderingContext2D;
  protected isMarried = false;
  private isPregnant = false;
  private isDeceased = false;
  private isProband = false;
  private isMultiple = false;
  private multipleIndividuals = 0;
  private storage: any;
  id: number = null;
  fillColor = "white";
  dragEnabled = false;
  isInLegend = false;
  twin = null;
  marriagePartner = null;
  size = 60;
  border = 3;
  x = 0;
  y = 0;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.id = IdGenerator.getId();
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.label = new Label(ctx, this);
  }
  private drawPregnant() {
    this.ctx.fillStyle = "black"
    this.ctx.fillText(
      `P`,
      this.getMidX() - this.ctx.measureText("P").width / 2,
      this.getMidY() + this.ctx.measureText("P").width / 2
    );
  }
  private drawMultiple() {
    this.ctx.fillStyle = "black"
    this.ctx.fillText(
      `${this.multipleIndividuals}`,
      this.getMidX() -
        this.ctx.measureText(`${this.multipleIndividuals}`).width / 2,
      this.getMidY() +
        this.ctx.measureText(`${this.multipleIndividuals}`).width / 2
    );
  }
  private drawDeceased() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.getX() - 10, this.getY() - 10);
    this.ctx.lineTo(this.getX() + this.size + 10, this.getY() + this.size + 10);
    this.ctx.stroke();
    this.ctx.closePath();
  }
  private drawProband() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.getX() - 24, this.getY() + 100);
    this.ctx.lineTo(this.getX(), this.getY() + 70);
    this.ctx.moveTo(this.getX(), this.getY() + 70);
    this.ctx.lineTo(this.getX() - 16, this.getY() + 75);
    this.ctx.moveTo(this.getX(), this.getY() + 70);
    this.ctx.lineTo(this.getX() - 1, this.getY() + 86);
    this.ctx.stroke();
    this.ctx.closePath();
  }
  protected drawTypes() {
    if (this.isPregnant) this.drawPregnant();
    if (this.isDeceased) this.drawDeceased();
    if (this.isProband) this.drawProband();
    if (this.isMultiple) this.drawMultiple();
  }
  protected drawDiseaseShape() {
    if (this.shapes.length > 0) {
      this.shapes.forEach((shape: ShapeProps) => {
        switch (shape.diseaseShape) {
          case "dot":
            shape.shapeInstance.drawDot(shape.diseaseColor);
            break;
          case "fill":
            shape.shapeInstance.fillColor(shape.diseaseColor);
            break;
          case "q1":
            shape.shapeInstance.fillFirstQuarterColor(shape.diseaseColor);
            break;
          case "q2":
            shape.shapeInstance.fillSecondQuarterColor(shape.diseaseColor);
            break;
          case "q3":
            shape.shapeInstance.fillThirdQuarterColor(shape.diseaseColor);
            break;
          case "q4":
            shape.shapeInstance.fillFourthQuarterColor(shape.diseaseColor);
            break;
        }
      });
    }
  }
  public setLabel(obj: any) {
    this.label.setLabel(obj);
  }
  public setStorage(obj: any) {
    this.storage = obj;
  }
  public getStorage() {
    return this.storage;
  }
  public draw() {
    this.initShape();
    this.drawDiseaseShape();
    this.drawTypes();
    this.label.drawLabel();
  }
  public getMidX() {
    return this.calculateMiddle().x + camera.OffsetX;
  }
  public getMidY() {
    return this.calculateMiddle().y + camera.OffsetY;
  }
  public getX() {
    return this.x + camera.OffsetX;
  }
  public getY() {
    return this.y + camera.OffsetY;
  }
  public getScaledX() {
    return this.x/this.ctx.getTransform().a + camera.OffsetX;
  }
  public getScaledY() {
    return this.y/this.ctx.getTransform().a + camera.OffsetY;
  }
  public getRawX() {
    return this.x;
  }
  public getRawY() {
    return this.y;
  }
  public getScaledRawX() {
    return this.x/this.ctx.getTransform().a;
  }
  public getScaledRawY() {
    return this.y/this.ctx.getTransform().a;
  }
  public calculateMiddle() {
    return {
      x: this.x + this.size / 2,
      y: this.y + this.size / 2,
    };
  }
  public clearShapes() {
    this.shapes = [];
    EventBus.emit("redraw");
  }
  public on(eventName, eventHandler) {
    EventBus.on(`${eventName}${this}`, () => eventHandler(this));
  }
  public setPregnancy(value: boolean) {
    this.isPregnant = value;
  }
  public setDeceased(value: boolean) {
    this.isDeceased = value;
  }
  public setProband(value: boolean) {
    this.isProband = value;
  }
  public setMultipleIndividuals(value: boolean, count: number) {
    this.isMultiple = value;
    this.multipleIndividuals = count;
  }
  abstract initShape();
  abstract addDiseaseShape(shape, color);
}
