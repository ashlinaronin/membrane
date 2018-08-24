import PixelGridScore from "./PixelGridScore";

export default class BreathingPixelGridScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);

    this.phase = 0;
    this.breath = 0;
  }

  drawScore(ctx) {
    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";
    this.drawGrid(ctx, "hsl(0, 100%, 95%)");
  }

  drawGrid(ctx, gridFillStyle) {
    this.phase = (this.phase + 0.01) % (2 * Math.PI);
    this.breath = Math.sin(this.phase) * 30;

    ctx.fillStyle = gridFillStyle;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === true) {
          ctx.fillRect(
            this.widthUnit * i,
            this.heightUnit * j,
            this.widthUnit + this.breath,
            this.heightUnit + this.breath
          );
        }
      }
    }
  }
}
