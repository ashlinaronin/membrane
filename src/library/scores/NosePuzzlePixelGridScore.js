import PixelGridScore from "./PixelGridScore";
import nosesImage from "../../assets/noses.jpg";

export default class NosePuzzlePixelGridScore extends PixelGridScore {
  constructor(scoreWidth, scoreHeight, videoWidth, videoHeight) {
    super(scoreWidth, scoreHeight, videoWidth, videoHeight);

    this.imgLoaded = false;
    this.img = new Image();
    this.img.src = nosesImage;
    this.img.onload = () => {
      this.imgLoaded = true;
    };
  }

  drawScore(ctx) {
    if (!this.imgLoaded) return;

    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(this.img, 0, 0, this.videoWidth, this.videoHeight);

    ctx.globalCompositeOperation = "source-atop";

    this.drawGrid(ctx, "white");

    ctx.globalCompositeOperation = "source-over";
  }
}
