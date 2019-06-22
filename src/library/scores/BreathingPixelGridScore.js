import PixelGridScore from "./PixelGridScore";
import { drawTriangle } from "./scoreHelpers";

const GRID_COLOR = "hsl(0, 100%, 95%)";

export default class BreathingPixelGridScore extends PixelGridScore {
  constructor(scoreWidth, scoreHeight, videoWidth, videoHeight) {
    super(scoreWidth, scoreHeight, videoWidth, videoHeight);

    this.phase = 0;
    this.breath = 0;
  }

  drawScore(ctx) {
    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";
    this.drawGrid(ctx, GRID_COLOR);
  }

  drawGrid(ctx, gridFillStyle) {
    this.phase = (this.phase + 0.01) % (2 * Math.PI);
    this.breath = Math.sin(this.phase) * 30;

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === true) {
          ctx.fillStyle = gridFillStyle;
          ctx.beginPath();

          this.smallerUnit =
            this.widthUnit < this.heightUnit ? this.widthUnit : this.heightUnit;
          this.halfSmallerUnit = this.smallerUnit / 2;
          this.x = this.widthUnit * i + this.halfSmallerUnit;
          this.y = this.heightUnit * j + this.halfSmallerUnit;

          ctx.arc(
            this.x,
            this.y,
            this.halfSmallerUnit + this.breath,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }
    }
  }

  drawNose(ctx, trianglePoints) {
    drawTriangle(ctx, trianglePoints, GRID_COLOR);
  }
}
