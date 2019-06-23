import {
  drawScore,
  scoreIsClear,
  handlePoseDetected,
  handleNoPoseDetected
} from "./scores/scoreManager";

import store from "../store";

import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  MIN_POSE_CONFIDENCE,
  MIN_PART_CONFIDENCE
} from "./constants";

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
export function detectPoseInRealTime(canvas, webcamVideo, net, stats) {
  const ctx = canvas.getContext("2d");

  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;

  async function poseDetectionFrame() {
    // Begin monitoring code for frames per second
    stats.begin();

    const poses = await net.estimatePoses(webcamVideo, {
      flipHorizontal: true,
      decodingMethod: "single-person"
    });

    drawScore(ctx, webcamVideo);
    drawPose(ctx, poses[0], webcamVideo);
    checkScoreAndLevelUp();

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

function drawPose(ctx, pose, webcamVideo) {
  if (pose.score < MIN_POSE_CONFIDENCE) {
    handleNoPoseDetected();
  } else {
    handlePoseDetected(pose.keypoints, MIN_PART_CONFIDENCE, ctx, webcamVideo);
  }
}

function checkScoreAndLevelUp() {
  if (scoreIsClear()) {
    store.dispatch("GO_TO_NEXT_LEVEL");
  }
}
