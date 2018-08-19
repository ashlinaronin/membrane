import PixelGridScore from "./PixelGridScore";
import nosesImage from "../../assets/noses.jpg";

export default class NosePuzzlePixelGridScore extends PixelGridScore {
  constructor(scoreResolution) {
    super(scoreResolution);

    this.imgLoaded = false;
    this.img = new Image();
    this.img.src = nosesImage;
    this.img.onload = () => {
      this.imgLoaded = true;
    };
  }

  drawScore(ctx, video, videoWidth, videoHeight) {
    if (!this.imgLoaded) return;

    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(this.img, 0, 0, videoWidth, videoHeight);

    ctx.globalCompositeOperation = "source-atop";

    this.drawGrid(ctx, videoWidth, videoHeight, "white");

    ctx.globalCompositeOperation = "source-over";
  }
}
