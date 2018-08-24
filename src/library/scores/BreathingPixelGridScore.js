import PixelGridScore from "./PixelGridScore";

export default class BreathingPixelGridScore extends PixelGridScore {
  constructor(scoreResolution) {
    super(scoreResolution);

    this.breath = 0;
  }

  drawScore(ctx, video, videoWidth, videoHeight) {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.globalCompositeOperation = "source-over";
    this.drawGrid(ctx, videoWidth, videoHeight, "hsl(0, 100%, 95%)");
  }

  drawGrid(ctx, videoWidth, videoHeight, gridFillStyle) {
    const widthUnit = videoWidth / this.width;
    const heightUnit = videoHeight / this.height;

    this.breath = (this.breath + 1) % 50;

    console.log(this.breath);

    ctx.fillStyle = gridFillStyle;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === true) {
          const width = widthUnit + this.breath;
          const height = heightUnit + this.breath;

          ctx.fillRect(widthUnit * i, heightUnit * j, width, height);
        }
      }
    }
  }
}
