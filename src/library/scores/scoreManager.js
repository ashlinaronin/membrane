import { SCORE_RESOLUTION, VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";
import GrassPixelGridScore from "./GrassPixelGridScore";
import WaterPixelGridScore from "./WaterPixelGridScore";
import ChemtrailsVideoScore from "./ChemtrailsVideoScore";
import FreezeFragmentScore from "./FreezeFragmentScore";
import VideoPixelGridScore from "./VideoPixelGridScore";

const scoreLevelMap = {
  1: VideoPixelGridScore,
  2: GrassPixelGridScore,
  3: WaterPixelGridScore,
  4: ChemtrailsVideoScore
};

const scoreNameMap = {
  default: VideoPixelGridScore,
  "freeze-fragment": FreezeFragmentScore
};

let score;

changeLevel(1);

export function changeScoreByName(name) {
  if (typeof score !== "undefined" && typeof score.dispose === "function") {
    score.dispose();
  }

  const scoreType = scoreNameMap.hasOwnProperty(name)
    ? scoreNameMap[name]
    : scoreNameMap.default;
  score = new scoreType(SCORE_RESOLUTION, VIDEO_WIDTH, VIDEO_HEIGHT);
}

export function changeLevel(level) {
  if (typeof score !== "undefined" && typeof score.dispose === "function") {
    score.dispose();
  }

  const scoreType = scoreLevelMap.hasOwnProperty(level)
    ? scoreLevelMap[level]
    : scoreLevelMap[1];
  score = new scoreType(SCORE_RESOLUTION, VIDEO_WIDTH, VIDEO_HEIGHT);
}

export function drawScore(ctx, webcamVideo) {
  return score.drawScore(ctx, webcamVideo);
}

export function handlePoseDetected(
  keypoints,
  minPartConfidence,
  ctx,
  webcamVideo
) {
  return score.handlePoseDetected(
    keypoints,
    minPartConfidence,
    ctx,
    webcamVideo
  );
}

export function handleNoPoseDetected() {
  return score.handleNoPoseDetected();
}

export function scoreIsClear() {
  return score.isClear();
}
