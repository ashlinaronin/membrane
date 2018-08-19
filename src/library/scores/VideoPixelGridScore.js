import { drawMirroredVideo } from "./scoreHelpers";
import PixelGridScore from "./PixelGridScore";

export default class VideoPixelGridScore extends PixelGridScore {
  constructor(scoreResolution) {
    super(scoreResolution);
  }

  drawScore(ctx, video, videoWidth, videoHeight) {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.globalCompositeOperation = "source-over";

    this.drawGrid(ctx, videoWidth, videoHeight, "black");

    ctx.globalCompositeOperation = "source-atop";

    drawMirroredVideo(ctx, video, videoWidth, videoHeight);

    ctx.globalCompositeOperation = "source-over";
  }
}
