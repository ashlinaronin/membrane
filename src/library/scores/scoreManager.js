import { SCORE_RESOLUTION } from "../constants";
import VideoPixelGridScore from "./VideoPixelGridScore";
import DerynPixelGridScore from "./DerynPixelGridScore";
import NosePuzzlePixelGridScore from "./NosePuzzlePixelGridScore";
import WaterPixelGridScore from "./WaterPixelGridScore";
import BreathingPixelGridScore from "./BreathingPixelGridScore";

const scoreLevelMap = {
  1: VideoPixelGridScore,
  2: BreathingPixelGridScore,
  3: DerynPixelGridScore,
  4: NosePuzzlePixelGridScore,
  5: WaterPixelGridScore
};

let score;

changeLevel(1);

export function changeLevel(level) {
  const scoreType = scoreLevelMap.hasOwnProperty(level)
    ? scoreLevelMap[level]
    : scoreLevelMap[1];
  score = new scoreType(SCORE_RESOLUTION);
}

export function drawScore(ctx, video, videoWidth, videoHeight) {
  return score.drawScore(ctx, video, videoWidth, videoHeight);
}

export function handlePoseDetected(
  keypoints,
  minPartConfidence,
  ctx,
  videoWidth,
  videoHeight
) {
  return score.handlePoseDetected(
    keypoints,
    minPartConfidence,
    ctx,
    videoWidth,
    videoHeight
  );
}

export function handleNoPoseDetected() {
  return score.handleNoPoseDetected();
}

export function scoreIsClear() {
  return score.isClear();
}
