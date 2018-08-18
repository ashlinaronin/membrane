import {
  drawPixelMap,
  generatePixelMap,
  calculateAndDrawMapPosition,
  mapIsEmpty
} from "./map";
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  FLIP_HORIZONTAL,
  IMAGE_SCALE_FACTOR,
  OUTPUT_STRIDE,
  MULTI_POSE_CONFIG,
  MAP_RESOLUTION
} from "./constants";

let waitingForNewMapFrames = 0;
const FRAMES_TO_WAIT_BETWEEN_MAPS = 24;
let map = generatePixelMap(MAP_RESOLUTION, MAP_RESOLUTION);

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

    drawMapAndVideo(ctx, video);
    drawPoses(ctx, poses);
    checkAndRegenerateMap();

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

function drawMapAndVideo(ctx, video) {
  ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  ctx.globalCompositeOperation = "source-over";

  drawPixelMap(ctx, VIDEO_WIDTH, VIDEO_HEIGHT, "black", map);

  ctx.globalCompositeOperation = "source-atop";

  drawMirroredVideo(ctx, video, VIDEO_WIDTH, VIDEO_HEIGHT, map);

  ctx.globalCompositeOperation = "source-over";
}

function drawPoses(ctx, poses) {
  // For each pose (i.e. person) detected in an image, loop through the poses
  // and draw the resulting skeleton and keypoints if over certain confidence
  // scores
  poses.forEach(({ score, keypoints }) => {
    if (score >= MULTI_POSE_CONFIG.MIN_POSE_CONFIDENCE) {
      calculateAndDrawMapPosition(
        keypoints,
        MULTI_POSE_CONFIG.MIN_PART_CONFIDENCE,
        ctx,
        map,
        VIDEO_WIDTH,
        VIDEO_HEIGHT
      );
    }
  });
}

function checkAndRegenerateMap() {
  // If map is empty, pause for 48 frames then generate a new map
  if (mapIsEmpty(map)) {
    waitingForNewMapFrames++;

    if (waitingForNewMapFrames > FRAMES_TO_WAIT_BETWEEN_MAPS) {
      map = generatePixelMap(MAP_RESOLUTION, MAP_RESOLUTION);
      waitingForNewMapFrames = 0;
    }
  }
}
