import PixelGridScore from "./PixelGridScore";

export default class PurplePixelGridScore extends PixelGridScore {
  constructor(scoreWidth, scoreHeight, videoWidth, videoHeight) {
    super(scoreWidth, scoreHeight, videoWidth, videoHeight);
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
          ctx.fillStyle = `hsl(${i * 12}, 60%, 50%)`;
          ctx.fillRect(
            this.widthUnit * i,
            this.heightUnit * j,
            this.widthUnit,
            this.heightUnit
          );
        }
      }
    }
  }
}
