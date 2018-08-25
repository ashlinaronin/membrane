import { SCORE_RESOLUTION, VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";
import VideoPixelGridScore from "./VideoPixelGridScore";
import GrassPixelGridScore from "./GrassPixelGridScore";
import WaterPixelGridScore from "./WaterPixelGridScore";
import BreathingPixelGridScore from "./BreathingPixelGridScore";

const scoreLevelMap = {
  1: VideoPixelGridScore,
  2: BreathingPixelGridScore,
  3: GrassPixelGridScore,
  4: WaterPixelGridScore
};

let score;

changeLevel(1);

export function changeLevel(level) {
  const scoreType = scoreLevelMap.hasOwnProperty(level)
    ? scoreLevelMap[level]
    : scoreLevelMap[1];
  score = new scoreType(SCORE_RESOLUTION, VIDEO_WIDTH, VIDEO_HEIGHT);
}

export function drawScore(ctx, webcamVideo) {
  return score.drawScore(ctx, webcamVideo);
}

export function handlePoseDetected(keypoints, minPartConfidence, ctx) {
  return score.handlePoseDetected(keypoints, minPartConfidence, ctx);
}

export function handleNoPoseDetected() {
  return score.handleNoPoseDetected();
}

export function scoreIsClear() {
  return score.isClear();
}
