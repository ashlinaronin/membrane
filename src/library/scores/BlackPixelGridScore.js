import PixelGridScore from "./PixelGridScore";

export default class BlackPixelGridScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);
  }

  drawScore(ctx) {
    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";
    this.drawGrid(ctx, "black");
  }
}
