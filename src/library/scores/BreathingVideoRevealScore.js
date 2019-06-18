import { startNote, endNote, changeParam } from "../synths/synthManager";
import { generateTrianglePoints } from "./scoreHelpers";
import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER,
  NOSE_TRIANGLE_RADIUS
} from "../constants";
import maxxPoem5 from "../../assets/maxx_poem_005.mp4";
import maxxCursor from "../../assets/maxx_cursor_nobg.png";

export default class BreathingVideoRevealScore {
  constructor(scoreResolution, videoWidth, videoHeight) {
    this.width = scoreResolution;
    this.height = scoreResolution;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.widthUnit = this.videoWidth / this.width;
    this.heightUnit = this.videoHeight / this.height;
    this.grid = this.generateScore();
    this.isPlaying = false;
    this.lastPosition = undefined;
    this.trianglePoints = undefined;
    this.framesSinceLastMovement = 0;
    this.phase = 0;
    this.breath = 0;

    this.onLoadedData = this.onLoadedData.bind(this);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = maxxPoem5;
    this.videoElement.loop = true;
    this.videoElement.addEventListener("loadeddata", this.onLoadedData, false);

    this.cursorImageLoaded = false;
    this.cursorImageElement = new Image();
    this.cursorImageElement.src = maxxCursor;
    this.cursorImageElement.onload = () => {
      this.cursorImageLoaded = true;
    };

    console.log(`created grid with ${this.calculateRemainingPoints()} points`);
  }

  onLoadedData() {
    this.videoLoaded = true;
    this.videoElement.play();
    this.videoElement.removeEventListener("loadeddata", this.onLoadedData);
  }

  drawScore(ctx) {
    if (!this.videoLoaded || !this.cursorImageLoaded) return;

    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    this.drawGrid(ctx, "black");

    ctx.globalCompositeOperation = "source-atop";

    ctx.drawImage(this.videoElement, 0, 0, this.videoWidth, this.videoHeight);
  }

  drawGrid(ctx, gridFillStyle) {
    this.phase = (this.phase + 0.01) % (2 * Math.PI);
    this.breath = Math.sin(this.phase) * 30;

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === false) {
          ctx.fillStyle = gridFillStyle;
          ctx.beginPath();

          this.smallerUnit =
            this.widthUnit < this.heightUnit ? this.widthUnit : this.heightUnit;
          this.halfSmallerUnit = this.smallerUnit / 2;
          this.x = this.widthUnit * i + this.halfSmallerUnit;
          this.y = this.heightUnit * j + this.halfSmallerUnit;

          ctx.arc(
            this.x,
            this.y,
            this.halfSmallerUnit + this.breath,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }
    }
  }

  drawNose(ctx, trianglePoints) {
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
      this.cursorImageElement,
      trianglePoints[0][0],
      trianglePoints[0][1],
      NOSE_TRIANGLE_RADIUS * 2,
      NOSE_TRIANGLE_RADIUS * 2
    );
  }

  generateScore() {
    const grid = [];

    for (let i = 0; i < this.width; i++) {
      grid[i] = [];
      for (let j = 0; j < this.height; j++) {
        grid[i][j] = true;
      }
    }

    return grid;
  }

  dispose() {
    this.grid = null;

    this.videoElement.pause();
    this.videoElement.removeAttribute("src");
    this.videoElement.load();
    this.videoElement = null;
  }

  isClear() {
    return !this.grid.some(row => row.some(col => col === true));
  }

  handleNoPoseDetected() {
    this.framesSinceLastMovement = this.framesSinceLastMovement + 1;
    this.checkForShouldEndNote();
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
    this.trianglePoints = generateTrianglePoints(x, y, NOSE_TRIANGLE_RADIUS);
    this.checkForGridPointPlayedAndRemove(this.trianglePoints);
    this.drawNose(ctx, this.trianglePoints);

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

      if (!this.isPlaying) {
        startNote();
        this.isPlaying = true;
      }

      this.lastPosition = [x, y];
    }
  }

  checkForGridPointPlayedAndRemove(trianglePoints) {
    let anyTrianglePointInGrid = false;

    trianglePoints.forEach(trianglePoint => {
      const gridCoordinates = this.getGridCoordinatesForPoint(
        trianglePoint[0],
        trianglePoint[1]
      );
      if (this.gridContainsPoint(gridCoordinates)) {
        anyTrianglePointInGrid = true;
        this.removePointFromGrid(gridCoordinates);
      }
    });

    return anyTrianglePointInGrid;
  }

  getGridCoordinatesForPoint(x, y) {
    let gridXCoord = Math.floor(x / this.widthUnit);
    let gridYCoord = Math.floor(y / this.heightUnit);

    // Account for edges of camera window
    if (gridXCoord >= this.width) {
      gridXCoord = this.width - 1;
    }

    if (gridYCoord >= this.height) {
      gridYCoord = this.height - 1;
    }

    if (gridXCoord <= 0) {
      gridXCoord = 0;
    }

    if (gridYCoord <= 0) {
      gridYCoord = 0;
    }

    return [gridXCoord, gridYCoord];
  }

  removePointFromGrid(gridPointCoords) {
    const [gridXCoord, gridYCoord] = gridPointCoords;
    this.grid[gridXCoord][gridYCoord] = false;
    console.log(`played point [${gridXCoord}, ${gridYCoord}]`);
    console.log(`${this.calculateRemainingPoints()} points remaining in grid`);
  }

  calculateRemainingPoints() {
    return this.grid.flat().filter(point => !!point).length;
  }

  gridContainsPoint(gridPointCoords) {
    const [gridXCoord, gridYCoord] = gridPointCoords;
    return this.grid[gridXCoord][gridYCoord] === true;
  }

  checkForShouldEndNote() {
    if (this.framesSinceLastMovement > FRAMES_BEFORE_MOVEMENT_DECLARED_OVER) {
      if (this.isPlaying) {
        endNote();
        this.isPlaying = false;
      }
    }
  }
}
