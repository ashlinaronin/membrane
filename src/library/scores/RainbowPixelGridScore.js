import PixelGridScore from "./PixelGridScore";

export default class PurplePixelGridScore extends PixelGridScore {
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
          ctx.fillRect(widthUnit * i, heightUnit * j, widthUnit, heightUnit);
        }
      }
    }
  }
}
