import PixelGridScore from "./PixelGridScore";

export default class CircleGridScore extends PixelGridScore {
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
          ctx.fillStyle = `hsl(${i * 12}, 60%, 50%)`;
          ctx.beginPath();

          const smallerUnit = widthUnit < heightUnit ? widthUnit : heightUnit;
          const halfSmallerUnit = smallerUnit / 2;
          const x = widthUnit * i + halfSmallerUnit;
          const y = heightUnit * j + halfSmallerUnit;

          ctx.arc(x, y, halfSmallerUnit, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }
}
