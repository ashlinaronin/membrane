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
  MULTI_POSE_CONFIG,
  FRAMES_TO_WAIT_BETWEEN_SCORES
} from "./constants";

let waitingForNewScoreFrames = 0;

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
export function detectPoseInRealTime(canvas, video, net, stats) {
  const ctx = canvas.getContext("2d");

  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;

  async function poseDetectionFrame() {
    // Begin monitoring code for frames per second
    stats.begin();

    const poses = await detectPoses(video, net);

    drawScoreAndVideo(ctx, video);
    drawPoses(ctx, poses);
    checkScoreAndLevelUp();

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

async function detectPoses(video, net) {
  // Scale an image down to a certain factor. Too large of an image will slow down the GPU
  return net.estimateMultiplePoses(
    video,
    IMAGE_SCALE_FACTOR,
    FLIP_HORIZONTAL,
    OUTPUT_STRIDE,
    MULTI_POSE_CONFIG.MAX_POSE_DETECTIONS,
    MULTI_POSE_CONFIG.MIN_PART_CONFIDENCE,
    MULTI_POSE_CONFIG.NMS_RADIUS
  );
}

function drawMirroredVideo(ctx, video, videoWidth, videoHeight) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-videoWidth, 0);
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  ctx.restore();
}

function drawScoreAndVideo(ctx, video) {
  ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  ctx.globalCompositeOperation = "source-over";

  drawScore(ctx, VIDEO_WIDTH, VIDEO_HEIGHT);

  ctx.globalCompositeOperation = "source-atop";

  drawMirroredVideo(ctx, video, VIDEO_WIDTH, VIDEO_HEIGHT);

  ctx.globalCompositeOperation = "source-over";
}

function drawPoses(ctx, poses) {
  // For each pose (i.e. person) detected in an image, loop through the poses
  // and draw the resulting skeleton and keypoints if over certain confidence
  // scores
  poses.forEach(({ confidence, keypoints }) => {
    if (confidence < MULTI_POSE_CONFIG.MIN_POSE_CONFIDENCE) {
      handleNoPoseDetected();
    } else {
      handlePoseDetected(
        keypoints,
        MULTI_POSE_CONFIG.MIN_PART_CONFIDENCE,
        ctx,
        VIDEO_WIDTH,
        VIDEO_HEIGHT
      );
    }
  });
}

function checkScoreAndLevelUp() {
  // If score is clear, pause for 48 frames then level up
  if (scoreIsClear()) {
    waitingForNewScoreFrames++;

    if (waitingForNewScoreFrames > FRAMES_TO_WAIT_BETWEEN_SCORES) {
      store.commit("LEVEL_UP");

      waitingForNewScoreFrames = 0;
    }
  }
}
