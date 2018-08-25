import PixelGridScore from "./PixelGridScore";
import { drawTriangle, drawMirroredVideo } from "./scoreHelpers";
import derynVideo from "../../assets/grass.mp4";

export default class GrassPixelGridScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = derynVideo;
    this.videoElement.loop = true;
    this.videoElement.play();

    this.videoElement.addEventListener(
      "loadeddata",
      () => {
        this.videoLoaded = true;
      },
      false
    );
  }

  drawScore(ctx, webcamVideo) {
    if (!this.videoLoaded) return;

    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    this.drawGrid(ctx, "black");

    ctx.globalCompositeOperation = "source-atop";

    drawMirroredVideo(ctx, webcamVideo, this.videoWidth, this.videoHeight);

    ctx.globalCompositeOperation = "destination-over";

    ctx.drawImage(this.videoElement, 0, 0, this.videoWidth, this.videoHeight);

    ctx.globalCompositeOperation = "source-over";
  }

  drawNose(ctx, trianglePoints) {
    drawTriangle(ctx, trianglePoints, "green");
  }
}
