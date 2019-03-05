import PixelGridScore from "./PixelGridScore";
import { NOSE_TRIANGLE_RADIUS } from "../constants";

export default class ChemtrailsScore extends PixelGridScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    super(scoreResolution, videoWidth, videoHeight);

    this.currentColor = "#000";
  }

  drawScore() {}

  drawNose(ctx, trianglePoints) {
    ctx.fillStyle = this.currentColor;
    ctx.beginPath();
    ctx.arc(
      trianglePoints[3][0],
      trianglePoints[3][1],
      NOSE_TRIANGLE_RADIUS / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}
