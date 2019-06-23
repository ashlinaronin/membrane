import { startNote, endNote, changeParam } from "../synths/synthManager";
import { drawTriangle, generateTrianglePoints } from "./scoreHelpers";
import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER,
  NOSE_TRIANGLE_RADIUS,
  NOSE_TRIANGLE_COLOR
} from "../constants";

export default class PixelGridScore {
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

    console.log(`created grid with ${this.calculateRemainingPoints()} points`);
  }

  generateScore() {
    const grid = [];

    for (let i = 0; i < this.width; i++) {
      grid[i] = [];
      for (let j = 0; j < this.height; j++) {
        grid[i][j] = Math.random() >= 0.5;
      }
    }

    return grid;
  }

  dispose() {
    this.grid = null;
  }

  isClear() {
    return !this.grid.some(row => row.some(col => col === true));
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

    const noseKeypoint = keypoints[0];

    if (noseKeypoint.score > minPartConfidence) {
      this.handleNoseFound(
        ctx,
        noseKeypoint.position.x,
        noseKeypoint.position.y
      );
    }
  }

  drawNose(ctx, trianglePoints) {
    drawTriangle(ctx, trianglePoints, NOSE_TRIANGLE_COLOR);
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
