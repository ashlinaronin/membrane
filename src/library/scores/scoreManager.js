import {
  SCORE_WIDTH,
  SCORE_HEIGHT,
  VIDEO_HEIGHT,
  VIDEO_WIDTH
} from "../constants";

let score;

export function changeScoreByClass(ScoreClassToCreate) {
  if (typeof score !== "undefined" && typeof score.dispose === "function") {
    score.dispose();
  }

  score = new ScoreClassToCreate(
    SCORE_WIDTH,
    SCORE_HEIGHT,
    VIDEO_WIDTH,
    VIDEO_HEIGHT
  );
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
