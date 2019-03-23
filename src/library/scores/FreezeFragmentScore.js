import { startNote, endNote, changeParam } from "../synths/synthManager";
import { drawMirroredVideoWithMask } from "./scoreHelpers";

import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER
} from "../constants";

const NOSE_CIRCLE_RADIUS = 15;
const TOTAL_POINTS_BEFORE_NEXT_LEVEL = 200;

export default class FreezeFragmentScore {
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
    this.uniquePointCount = 0;
    this.pointsPlayed = [];
    this.videoFrozen = false;
    this.freezeFrameCanvas = document.createElement("canvas");
    this.freezeFrameCanvas.width = this.videoWidth;
    this.freezeFrameCanvas.height = this.videoHeight;
    this.freezeFrameCtx = this.freezeFrameCanvas.getContext("2d");
  }

  drawScore(ctx, webcamVideo) {
    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    // this.pointsPlayed.forEach(point => this.drawNose(ctx, point[0], point[1]));

    drawMirroredVideoWithMask(
      ctx,
      this.freezeFrameCanvas,
      this.videoWidth,
      this.videoHeight,
      0,
      0,
      [[this.videoWidth / 2, 0], [this.videoWidth / 2, this.videoHeight]]
    );

    ctx.globalCompositeOperation = "multiply";

    drawMirroredVideoWithMask(
      ctx,
      webcamVideo,
      this.videoWidth,
      this.videoHeight,
      this.videoWidth / 2,
      0,
      [[0, 0], [this.videoWidth / 2, this.videoHeight]]
    );

    ctx.globalCompositeOperation = "source-over";
  }

  drawNose(ctx, x, y) {
    ctx.fillStyle = this.currentColor;
    ctx.beginPath();
    ctx.arc(x, y, NOSE_CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }

  handlePoseDetected(keypoints, minPartConfidence, ctx, webcamVideo) {
    this.checkForShouldEndNote();

    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];

      if (keypoint.score < minPartConfidence) {
        continue;
      }

      if (keypoint.part === "nose") {
        this.handleNoseFound(
          ctx,
          keypoint.position.x,
          keypoint.position.y,
          webcamVideo
        );
      }
    }
  }

  handleNoseFound(ctx, x, y, webcamVideo) {
    this.drawNose(ctx, x, y);
    const collided = this.checkCollisions(x, y);

    if (typeof this.lastPosition === "undefined") {
      this.lastPosition = [x, y];
    }

    changeParam(x, y, this.videoWidth, this.videoHeight);
    this.framesSinceLastMovement = this.framesSinceLastMovement + 1;

    const lastPointWasCollision = this.checkCollisions(
      this.lastPosition[0],
      this.lastPosition[1]
    );

    if (collided) {
      // note this will result in a memory leak if it continues indefinitely
      this.pointsPlayed.push([x, y]);
    }

    if (!collided && lastPointWasCollision) {
      this.freezeVideo(webcamVideo);
    }

    this.videoFrozen = !collided;

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
    this.isPlaying = true;
    this.uniquePointCount = this.uniquePointCount + 1;
    console.log("uniquePointCount", this.uniquePointCount);

    startNote();
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

  freezeVideo(webcamVideo) {
    // todo: only freeze part of video?
    this.freezeFrameCtx.drawImage(
      webcamVideo,
      0,
      0,
      this.videoWidth,
      this.videoHeight
    );
  }

  handleNoPoseDetected() {
    this.framesSinceLastMovement = this.framesSinceLastMovement + 1;
    this.checkForShouldEndNote();
  }

  isClear() {
    return this.uniquePointCount > TOTAL_POINTS_BEFORE_NEXT_LEVEL;
  }
}
