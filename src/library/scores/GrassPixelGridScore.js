import PixelGridScore from "./PixelGridScore";
import { drawTriangle, drawMirroredVideo } from "./scoreHelpers";
import grassVideo from "../../assets/grass-35-default-compression.mp4";

export default class GrassPixelGridScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);

    this.onLoadedData = this.onLoadedData.bind(this);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = grassVideo;
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

  drawScore(ctx, webcamVideo) {
    if (!this.videoLoaded) return;

    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    this.drawGrid(ctx, "black");

    ctx.globalCompositeOperation = "source-atop";

    drawMirroredVideo(ctx, webcamVideo, this.videoWidth, this.videoHeight);

    // multiply, darken, difference, exclusion, hue, color is also nice
    ctx.globalCompositeOperation = "luminosity";

    ctx.drawImage(this.videoElement, 0, 0, this.videoWidth, this.videoHeight);

    ctx.globalCompositeOperation = "source-over";
  }

  drawNose(ctx, trianglePoints) {
    drawTriangle(ctx, trianglePoints, "hsl(94, 71%, 22%)");
  }
}
