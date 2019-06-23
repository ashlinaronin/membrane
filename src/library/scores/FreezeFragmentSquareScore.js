import { startNote, endNote, changeParam } from "../synths/synthManager";
import { drawMirroredVideo } from "./scoreHelpers";

import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER,
  NOSE_KEYPOINT_INDEX
} from "../constants";

const NOSE_CIRCLE_RADIUS = 15;
const FREEZE_COUNT_THRESHOLD = 50;

export default class FreezeFragmentSquareScore {
  constructor(scoreWidth, scoreHeight, videoWidth, videoHeight) {
    this.currentColor = "#000";
    this.width = scoreWidth;
    this.height = scoreHeight;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.bigCircleRadius = this.videoWidth / 4;
    this.bigCircleX = this.videoWidth / 2;
    this.bigCircleY = this.videoHeight / 2;
    this.isPlaying = false;
    this.lastPosition = undefined;
    this.framesSinceLastMovement = 0;
    this.pointsPlayed = [];
    this.videoFrozen = false;
    this.freezeFrameCanvas = document.createElement("canvas");
    this.freezeFrameCanvas.width = this.videoWidth;
    this.freezeFrameCanvas.height = this.videoHeight;
    this.freezeFrameCtx = this.freezeFrameCanvas.getContext("2d");
    this.freezeCount = 0;
  }

  drawScore(ctx, webcamVideo) {
    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    this.pointsPlayed.forEach(point => this.drawNose(ctx, point[0], point[1]));

    ctx.globalCompositeOperation = "source-atop";

    drawMirroredVideo(
      ctx,
      webcamVideo,
      this.videoWidth,
      this.videoHeight,
      0,
      0
    );

    ctx.globalCompositeOperation = "screen";

    drawMirroredVideo(
      ctx,
      this.freezeFrameCanvas,
      this.videoWidth,
      this.videoHeight,
      0,
      0
    );

    ctx.globalCompositeOperation = "source-over";
  }

  drawNose(ctx, x, y) {
    ctx.fillStyle = this.currentColor;
    ctx.fillRect(x, y, NOSE_CIRCLE_RADIUS * 2, NOSE_CIRCLE_RADIUS * 2);
  }

  handlePoseDetected(keypoints, minPartConfidence, ctx, webcamVideo) {
    this.checkForShouldEndNote();

    const noseKeypoint = keypoints[NOSE_KEYPOINT_INDEX];

    if (noseKeypoint.score > minPartConfidence) {
      this.handleNoseFound(
        ctx,
        noseKeypoint.position.x,
        noseKeypoint.position.y,
        webcamVideo
      );
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
      this.freezeVideo(webcamVideo, x, y);
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

    startNote();
  }

  checkCollisions(x, y) {
    const dx = this.bigCircleX - x;
    const dy = this.bigCircleY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this.bigCircleRadius + NOSE_CIRCLE_RADIUS * 2;
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

  freezeVideo(webcamVideo, noseX, noseY) {
    this.freezeFrameCtx.save();

    this.freezeFrameCtx.globalCompositeOperation = "screen";

    // Create a square
    this.freezeFrameCtx.beginPath();
    this.freezeFrameCtx.rect(
      this.videoWidth - noseX,
      noseY,
      NOSE_CIRCLE_RADIUS * 6,
      NOSE_CIRCLE_RADIUS * 6
    );
    this.freezeFrameCtx.clip();

    this.freezeFrameCtx.drawImage(
      webcamVideo,
      0,
      0,
      this.videoWidth,
      this.videoHeight
    );

    this.freezeFrameCtx.restore();

    this.freezeCount = this.freezeCount + 1;
    console.log("freezeCount", this.freezeCount);
  }

  handleNoPoseDetected() {
    this.framesSinceLastMovement = this.framesSinceLastMovement + 1;
    this.checkForShouldEndNote();
  }

  isClear() {
    return this.freezeCount > FREEZE_COUNT_THRESHOLD;
  }
}
