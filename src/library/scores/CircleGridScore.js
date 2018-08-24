import PixelGridScore from "./PixelGridScore";

export default class CircleGridScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);

    // Reuse vars to avoid allocating lots of new memory every frame
    this.smallerUnit = undefined;
    this.halfSmallerUnit = undefined;
    this.x = undefined;
    this.y = undefined;
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
          ctx.beginPath();

          this.smallerUnit =
            this.widthUnit < this.heightUnit ? this.widthUnit : this.heightUnit;
          this.halfSmallerUnit = this.smallerUnit / 2;
          this.x = this.widthUnit * i + this.halfSmallerUnit;
          this.y = this.heightUnit * j + this.halfSmallerUnit;

          ctx.arc(this.x, this.y, this.halfSmallerUnit, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }
}
