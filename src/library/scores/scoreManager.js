import { SCORE_RESOLUTION } from "../constants";
import VideoPixelGridScore from "./VideoPixelGridScore";
import BlackPixelGridScore from "./BlackPixelGridScore";
import PurplePixelGridScore from "./PurplePixelGridScore";
import RainbowPixelGridScore from "./RainbowPixelGridScore";
import CircleGridScore from "./CircleGridScore";
import NosePuzzlePixelGridScore from "./NosePuzzlePixelGridScore";

const scoreLevelMap = {
  1: VideoPixelGridScore,
  2: BlackPixelGridScore,
  3: PurplePixelGridScore,
  4: RainbowPixelGridScore,
  5: CircleGridScore,
  6: NosePuzzlePixelGridScore
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
