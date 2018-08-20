import PixelGridScore from "./PixelGridScore";
import { NOSE_TRIANGLE_RADIUS } from "../constants";
import { drawTriangle, generateTrianglePoints } from "./scoreHelpers";

export default class CircleNoseTriangleGridScore extends PixelGridScore {
  constructor(scoreResolution) {
    super(scoreResolution);
  }

  drawScore(ctx, video, videoWidth, videoHeight) {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.globalCompositeOperation = "source-over";
    this.drawGrid(ctx, videoWidth, videoHeight);
  }

  // overrides PixelGridScore's generic grid
  drawGrid(ctx, videoWidth, videoHeight) {
    const widthUnit = videoWidth / this.width;
    const heightUnit = videoHeight / this.height;

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === true) {
          const smallerUnit = widthUnit < heightUnit ? widthUnit : heightUnit;
          const halfSmallerUnit = smallerUnit / 2;
          const x = widthUnit * i + halfSmallerUnit;
          const y = heightUnit * j + halfSmallerUnit;

          const color = `hsl(${i * 12}, 60%, 50%)`;
          const trianglePoints = generateTrianglePoints(
            x,
            y,
            NOSE_TRIANGLE_RADIUS * 2
          );
          drawTriangle(ctx, trianglePoints, color);
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
