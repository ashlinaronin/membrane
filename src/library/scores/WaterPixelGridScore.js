import PixelGridScore from "./PixelGridScore";
import waterVideo from "../../assets/water.mp4";

export default class WaterPixelGridScore extends PixelGridScore {
  constructor(scoreResolution) {
    super(scoreResolution);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = waterVideo;
    this.videoElement.play();

    this.videoElement.addEventListener(
      "loadeddata",
      () => {
        this.videoLoaded = true;
      },
      false
    );
  }

  drawScore(ctx, video, videoWidth, videoHeight) {
    if (!this.videoLoaded) return;

    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(this.videoElement, 0, 0, videoWidth, videoHeight);

    ctx.globalCompositeOperation = "source-atop";

    this.drawGrid(ctx, videoWidth, videoHeight, "white");

    ctx.globalCompositeOperation = "source-over";
  }
}
