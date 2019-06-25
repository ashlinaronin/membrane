import { startNote, endNote, changeParam } from "../synths/synthManager";
import {
  MIN_DISTANCE_TO_PLAY,
  FRAMES_BEFORE_MOVEMENT_DECLARED_OVER,
  NOSE_TRIANGLE_RADIUS,
  NOSE_KEYPOINT_INDEX
} from "../constants";
import maxxLong from "../../assets/maxx_long_compressed.mp4";
import maxxCursor from "../../assets/maxx_cursor_nobg.png";

const BREATH_SPEED = 0.03;

function coordsEqual(a, b) {
  if (!a || a.length !== 2 || !b || b.length !== 2) return false;
  return a[0] === b[0] && a[1] === b[1];
}

export default class BreathingVideoRevealScore {
  constructor(scoreWidth, scoreHeight, videoWidth, videoHeight) {
    this.width = scoreWidth;
    this.height = scoreHeight;
    this.videoWidth = videoWidth;
    this.videoHeight = videoHeight;
    this.widthUnit = this.videoWidth / this.width;
    this.heightUnit = this.videoHeight / this.height;
    this.grid = this.generateScore();
    this.isPlaying = false;
    this.lastAudioPlayedPosition = undefined;
    this.trianglePoints = undefined;
    this.framesSinceLastMovement = 0;
    this.phase = 0;
    this.breath = 0;

    this.onLoadedData = this.onLoadedData.bind(this);

    this.videoLoaded = false;
    this.videoElement = document.createElement("video");
    this.videoElement.src = maxxLong;
    this.videoElement.loop = true;
    this.videoElement.muted = true;
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
    this.phase = (this.phase + BREATH_SPEED) % (2 * Math.PI);
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

  drawNose(ctx, x, y) {
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
      this.cursorImageElement,
      x,
      y,
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

    const noseKeypoint = keypoints[NOSE_KEYPOINT_INDEX];

    if (noseKeypoint.score > minPartConfidence) {
      this.handleNoseFound(
        ctx,
        noseKeypoint.position.x,
        noseKeypoint.position.y
      );
    }
  }

  handleNoseFound(ctx, x, y) {
    const gridCoordinates = this.getGridCoordinatesForPoint(x, y);
    this.checkForGridPointPlayedAndAddOrRemove(gridCoordinates);
    this.drawNose(ctx, x, y);

    if (typeof this.lastAudioPlayedPosition === "undefined") {
      this.lastAudioPlayedPosition = [x, y];
    }

    // Always save lastGridPosition, regardless of whether or not we play audio
    this.lastGridPosition = gridCoordinates;

    changeParam(x, y, this.videoWidth, this.videoHeight);
    this.framesSinceLastMovement = this.framesSinceLastMovement + 1;

    if (
      Math.abs(this.lastAudioPlayedPosition[0] - x) > MIN_DISTANCE_TO_PLAY ||
      Math.abs(this.lastAudioPlayedPosition[1] - y) > MIN_DISTANCE_TO_PLAY
    ) {
      this.framesSinceLastMovement = 0;

      if (!this.isPlaying) {
        startNote();
        this.isPlaying = true;
      }

      this.lastAudioPlayedPosition = [x, y];
    }
  }

  checkForGridPointPlayedAndAddOrRemove(gridCoordinates) {
    // track last grid position, only add or remove from grid if we are on a new tile
    if (coordsEqual(this.lastGridPosition, gridCoordinates)) {
      return;
    }

    if (this.gridContainsPoint(gridCoordinates)) {
      this.removePointFromGrid(gridCoordinates);
    } else {
      this.addPointToGrid(gridCoordinates);
    }
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

  addPointToGrid(gridPointCoords) {
    const [gridXCoord, gridYCoord] = gridPointCoords;
    this.grid[gridXCoord][gridYCoord] = true;
    console.log(`added back point [${gridXCoord}, ${gridYCoord}]`);
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
