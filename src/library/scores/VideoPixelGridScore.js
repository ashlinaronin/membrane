import { drawMirroredVideo } from "./scoreHelpers";
import PixelGridScore from "./PixelGridScore";

export default class VideoPixelGridScore extends PixelGridScore {
  constructor(scoreWidth, scoreHeight, videoWidth, videoHeight) {
    super(scoreWidth, scoreHeight, videoWidth, videoHeight);
  }

  drawScore(ctx, webcamVideo) {
    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    this.drawGrid(ctx, "black");

    ctx.globalCompositeOperation = "source-atop";

    drawMirroredVideo(ctx, webcamVideo, this.videoWidth, this.videoHeight);

    ctx.globalCompositeOperation = "hue";

    this.drawGrid(ctx, "black");

    ctx.globalCompositeOperation = "source-over";
  }
}
