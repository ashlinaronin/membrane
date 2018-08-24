import PixelGridScore from "./PixelGridScore";
import { NOSE_TRIANGLE_RADIUS } from "../constants";
import { drawTriangle, generateTrianglePoints } from "./scoreHelpers";

export default class CircleNoseTriangleGridScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);

    // Reuse vars to avoid allocating lots of new memory every frame
    this.smallerUnit = undefined;
    this.halfSmallerUnit = undefined;
    this.x = undefined;
    this.y = undefined;
    this.trianglePoints = undefined;
  }

  drawScore(ctx) {
    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";
    this.drawGrid(ctx);
  }

  // overrides PixelGridScore's generic grid
  drawGrid(ctx) {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === true) {
          this.smallerUnit =
            this.widthUnit < this.heightUnit ? this.widthUnit : this.heightUnit;
          this.halfSmallerUnit = this.smallerUnit / 2;
          this.x = this.widthUnit * i + this.halfSmallerUnit;
          this.y = this.heightUnit * j + this.halfSmallerUnit;

          this.trianglePoints = generateTrianglePoints(
            this.x,
            this.y,
            NOSE_TRIANGLE_RADIUS * 2
          );
          drawTriangle(ctx, this.trianglePoints, `hsl(${i * 12}, 60%, 50%)`);
        }
      }
    }
  }

  drawNose(ctx, trianglePoints) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      trianglePoints[3][0],
      trianglePoints[3][1],
      NOSE_TRIANGLE_RADIUS / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}
