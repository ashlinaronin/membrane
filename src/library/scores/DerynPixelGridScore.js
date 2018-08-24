import PixelGridScore from "./PixelGridScore";
import { drawTriangle } from "./scoreHelpers";
import derynVideo from "../../assets/derynose.mp4";

export default class DerynPixelGridScore extends PixelGridScore {
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

  drawScore(ctx) {
    if (!this.videoLoaded) return;

    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(this.videoElement, 0, 0, this.videoWidth, this.videoHeight);

    ctx.globalCompositeOperation = "source-atop";

    this.drawGrid(ctx, "white");

    ctx.globalCompositeOperation = "source-over";
  }

  drawNose(ctx, trianglePoints) {
    drawTriangle(ctx, trianglePoints, "white");
  }
}
