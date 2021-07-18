import BasePedigree from "./BasePedigree";
import Camera from "../Camera";
import UnknownShape from "../diseaseShapes/UnknownShapes";

export default class UnknownPedigree extends BasePedigree {
  initShape() {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.border;
    this.ctx.strokeStyle = "black";
    const size2 = this.size / 2;
    this.ctx.moveTo(this.x + Camera.OffsetX, this.y + size2 + Camera.OffsetY);
    this.ctx.lineTo(this.x + size2 + Camera.OffsetX, this.y + Camera.OffsetY);
    this.ctx.lineTo(
      this.x + this.size + Camera.OffsetX,
      this.y + size2 + Camera.OffsetY
    );
    this.ctx.lineTo(
      this.x + size2 + Camera.OffsetX,
      this.y + this.size + Camera.OffsetY
    );
    this.ctx.lineTo(this.x + Camera.OffsetX, this.y + size2 + Camera.OffsetY);
    this.ctx.stroke();
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawPedigree() {
    this.initShape();
    this.label.drawLabel();
    this.drawDiseaseShape();
  }
  setDiseaseShape(shape, color) {
    this.diseaseShape = shape;
    this.diseaseColor = color;
    this.shape = new UnknownShape(this.ctx, this);
    this.drawDiseaseShape();
  }
  drawDiseaseShape() {
    if (this.shape) {
      switch (this.diseaseShape) {
        case "dot":
          this.shape.drawDot(this.diseaseColor);
          break
        case "fill":
          this.shape.fillColor(this.diseaseColor);
          break;
        case "q1":
          this.shape.fillFirstQuarterColor(this.diseaseColor);
          break;
        case "q2":
          this.shape.fillSecondQuarterColor(this.diseaseColor);
          break;
        case "q3":
          this.shape.fillThirdQuarterColor(this.diseaseColor);
          break;
        case "q4":
          this.shape.fillFourthQuarterColor(this.diseaseColor);
          break;
      }
    }
  }
  updateConfig() {}
  setLabel(obj) {
    this.label.setLabel(obj);
  }
}