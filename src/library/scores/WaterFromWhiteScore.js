import waterVideo from "../../assets/water-bader.mp4";
import { startNote, endNote, changeParam } from "../synths/synthManager";
import { drawTriangle, generateTrianglePoints } from "./scoreHelpers";
import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER,
  NOSE_TRIANGLE_RADIUS,
  NOSE_KEYPOINT_INDEX
} from "../constants";

const POINTS_PLAYED_THRESHOLD = 70;

export default class WaterFromWhiteScore {
  constructor(scoreWidth, scoreHeight, videoWidth, videoHeight) {
    this.width = scoreWidth;
    this.height = scoreHeight;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.widthUnit = this.videoWidth / this.width;
    this.heightUnit = this.videoHeight / this.height;
    this.grid = this.generateScore();
    this.isPlaying = false;
    this.lastPosition = undefined;
    this.trianglePoints = undefined;
    this.framesSinceLastMovement = 0;
    this.pointsPlayedCount = 0;

    this.onLoadedData = this.onLoadedData.bind(this);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = waterVideo;
    this.videoElement.muted = true;
    this.videoElement.loop = true;
    this.videoElement.addEventListener("loadeddata", this.onLoadedData, false);

    console.log(`created grid with ${this.calculateRemainingPoints()} points`);
  }

  onLoadedData() {
    this.videoLoaded = true;

    // Don't have access to score's "this" inside promise chain on .play()
    const scoreScope = this;

    this.videoElement
      .play()
      .catch(err => {
        // probably can't autoplay because we don't have user input
        console.error(err);
      })
      .finally(() => {
        scoreScope.videoElement.removeEventListener(
          "loadeddata",
          scoreScope.onLoadedData
        );
      });
  }

  isClear() {
    return this.pointsPlayedCount > POINTS_PLAYED_THRESHOLD;
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
    const noseKeypoint = keypoints[NOSE_KEYPOINT_INDEX];
    if (noseKeypoint.score > minPartConfidence) {
      this.handleNoseFound(
        ctx,
        noseKeypoint.position.x,
        noseKeypoint.position.y
      );
    }
  }

  drawScore(ctx) {
    if (!this.videoLoaded) return;

    ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    ctx.globalCompositeOperation = "source-over";

    this.drawGrid(ctx, "white");

    ctx.globalCompositeOperation = "source-atop";

    ctx.drawImage(this.videoElement, 0, 0, this.videoWidth, this.videoHeight);

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
    this.pointsPlayedCount = this.pointsPlayedCount + 1;
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
