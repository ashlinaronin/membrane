import PixelGridScore from "./PixelGridScore";
import { drawTriangle } from "./scoreHelpers";
import waterVideo from "../../assets/water-35-default-compression.mp4";

export default class WaterPixelGridScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);

    this.onLoadedData = this.onLoadedData.bind(this);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = waterVideo;
    this.videoElement.loop = true;
    this.videoElement.addEventListener("loadeddata", this.onLoadedData, false);
  }

  onLoadedData() {
    this.videoLoaded = true;
    this.videoElement.play();
    this.videoElement.removeEventListener("loadeddata", this.onLoadedData);
  }

  dispose() {
    this.videoElement.pause();
    this.videoElement.removeAttribute("src");
    this.videoElement.load();
    this.videoElement = null;
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
