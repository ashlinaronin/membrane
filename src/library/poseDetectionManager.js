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
  FLIP_HORIZONTAL,
  IMAGE_SCALE_FACTOR,
  OUTPUT_STRIDE,
  MULTI_POSE_CONFIG
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

    const singlePose = await detectPose(webcamVideo, net);

    drawScore(ctx, webcamVideo);
    drawPose(ctx, singlePose, webcamVideo);
    checkScoreAndLevelUp();

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

async function detectPose(video, net) {
  return net.estimateSinglePose(
    video,
    IMAGE_SCALE_FACTOR,
    FLIP_HORIZONTAL,
    OUTPUT_STRIDE
  );
}

function drawPose(ctx, pose, webcamVideo) {
  if (pose.score < MULTI_POSE_CONFIG.MIN_POSE_CONFIDENCE) {
    handleNoPoseDetected();
  } else {
    handlePoseDetected(
      pose.keypoints,
      MULTI_POSE_CONFIG.MIN_PART_CONFIDENCE,
      ctx,
      webcamVideo
    );
  }
}

function checkScoreAndLevelUp() {
  if (scoreIsClear()) {
    store.commit("LEVEL_UP");
  }
}
