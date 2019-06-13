import waterVideo from "../../assets/water-35-default-compression.mp4";
import { startNote, endNote, changeParam } from "../synths/synthManager";
import { drawTriangle, generateTrianglePoints } from "./scoreHelpers";
import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER,
  NOSE_TRIANGLE_RADIUS
} from "../constants";

export default class WaterFromWhiteScore {
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

    this.onLoadedData = this.onLoadedData.bind(this);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = waterVideo;
    this.videoElement.loop = true;
    this.videoElement.addEventListener("loadeddata", this.onLoadedData, false);

    console.log(`created grid with ${this.calculateRemainingPoints()} points`);
  }

  onLoadedData() {
    this.videoLoaded = true;
    this.videoElement.play();
    this.videoElement.removeEventListener("loadeddata", this.onLoadedData);
  }

  isClear() {
    return this.grid.every(row => row.every(col => col === true));
  }

  generateScore() {
    const grid = [];

    for (let i = 0; i < this.width; i++) {
      grid[i] = [];
      for (let j = 0; j < this.height; j++) {
        grid[i][j] = false;
      }
    }

    return grid;
  }

  dispose() {
    this.videoElement.pause();
    this.videoElement.removeAttribute("src");
    this.videoElement.load();
    this.videoElement = null;
    this.grid = null;
  }

  drawGrid(ctx, gridFillStyle) {
    ctx.fillStyle = gridFillStyle;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === true) {
          ctx.fillRect(
            this.widthUnit * i,
            this.heightUnit * j,
            this.widthUnit,
            this.heightUnit
          );
        }
      }
    }
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

  drawScore(ctx) {
    if (!this.videoLoaded) return;

    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(this.videoElement, 0, 0, this.videoWidth, this.videoHeight);

    ctx.globalCompositeOperation = "source-atop";

    this.drawGrid(ctx, "black");

    ctx.globalCompositeOperation = "source-over";
  }

  handleNoseFound(ctx, x, y) {
    this.trianglePoints = generateTrianglePoints(x, y, NOSE_TRIANGLE_RADIUS);
    this.checkForGridPointPlayedAndAdd(this.trianglePoints);
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

  drawNose(ctx, trianglePoints) {
    drawTriangle(ctx, trianglePoints, "white");
  }

  checkForGridPointPlayedAndAdd(trianglePoints) {
    let anyTrianglePointInGrid = false;

    trianglePoints.forEach(trianglePoint => {
      const gridCoordinates = this.getGridCoordinatesForPoint(
        trianglePoint[0],
        trianglePoint[1]
      );
      if (!this.gridContainsPoint(gridCoordinates)) {
        anyTrianglePointInGrid = true;
        this.addPointToGrid(gridCoordinates);
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

  addPointToGrid(gridPointCoords) {
    const [gridXCoord, gridYCoord] = gridPointCoords;
    this.grid[gridXCoord][gridYCoord] = true;
    console.log(`played point [${gridXCoord}, ${gridYCoord}]`);
    console.log(
      `${this.calculateRemainingPoints()} points played in grid of ${this
        .width * this.height}`
    );
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
