import { startNote, endNote, changeParam } from "../synths/synthManager";

import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER
} from "../constants";

const NOSE_CIRCLE_RADIUS = 10;
const TOTAL_POINTS_BEFORE_NEXT_LEVEL = 100;

export default class ChemtrailsOutlineScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    this.currentColor = "#000";
    this.width = scoreResolution;
    this.height = scoreResolution;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.bigCircleRadius = this.videoWidth / 4;
    this.bigCircleX = this.videoWidth / 2;
    this.bigCircleY = this.videoHeight / 2;
    this.isPlaying = false;
    this.lastPosition = undefined;
    this.framesSinceLastMovement = 0;
    this.totalPointsPlayed = 0;
  }

  drawScore(ctx) {
    const isFirstFrame = typeof this.lastPosition === "undefined";

    if (!isFirstFrame) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(
      this.bigCircleX,
      this.bigCircleY,
      this.bigCircleRadius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  drawNose(ctx, x, y) {
    ctx.globalCompositeOperation = "hue";
    ctx.fillStyle = this.currentColor;
    ctx.beginPath();
    ctx.arc(x, y, NOSE_CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }

  handlePoseDetected(keypoints, minPartConfidence, ctx) {
    this.checkForShouldEndNote();

    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];

      if (keypoint.score < minPartConfidence) {
        continue;
      }

      if (keypoint.part === "nose") {
        this.handleNoseFound(ctx, keypoint.position.x, keypoint.position.y);
      }
    }
  }

  handleNoseFound(ctx, x, y) {
    this.drawNose(ctx, x, y);
    const collided = this.checkCollisions(x, y);

    if (typeof this.lastPosition === "undefined") {
      this.lastPosition = [x, y];
    }

    changeParam(x, y, this.videoWidth, this.videoHeight);
    this.framesSinceLastMovement = this.framesSinceLastMovement + 1;

    if (
      Math.abs(this.lastPosition[0] - x) > MIN_DISTANCE_TO_PLAY ||
      Math.abs(this.lastPosition[1] - y) > MIN_DISTANCE_TO_PLAY
    ) {
      this.framesSinceLastMovement = 0;

      if (!this.isPlaying && collided) {
        this.play();
      }

      this.lastPosition = [x, y];
    }
  }

  play() {
    startNote();
    this.isPlaying = true;

    this.totalPointsPlayed = this.totalPointsPlayed + 1;
    console.log("totalPointsPlayed", this.totalPointsPlayed);
  }

  checkCollisions(x, y) {
    const dx = this.bigCircleX - x;
    const dy = this.bigCircleY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this.bigCircleRadius + NOSE_CIRCLE_RADIUS;
  }

  checkForShouldEndNote() {
    if (
      this.framesSinceLastMovement > FRAMES_BEFORE_MOVEMENT_DECLARED_OVER &&
      this.isPlaying
    ) {
      endNote();
      this.isPlaying = false;
    }
  }

  handleNoPoseDetected() {
    this.framesSinceLastMovement = this.framesSinceLastMovement + 1;
    this.checkForShouldEndNote();
  }

  isClear() {
    return this.totalPointsPlayed > TOTAL_POINTS_BEFORE_NEXT_LEVEL;
  }
}
