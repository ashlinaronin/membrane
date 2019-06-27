const isSarah = window.location.hash.includes("sarah");

export const VIDEO_WIDTH = isSarah ? 640 : 1280;
export const VIDEO_HEIGHT = isSarah ? 480 : 720;
export const SCORE_WIDTH = isSarah ? 8 : 16;
export const SCORE_HEIGHT = isSarah ? 8 : 10;

export const MIN_POSE_CONFIDENCE = 0.15;
export const MIN_PART_CONFIDENCE = 0.1;
export const NOSE_KEYPOINT_INDEX = 0;

export const MIN_DISTANCE_TO_PLAY = 26;
export const FRAMES_BEFORE_MOVEMENT_DECLARED_OVER = 1;

export const NOSE_TRIANGLE_RADIUS = 20;
export const NOSE_TRIANGLE_COLOR = "black";

export const NUM_LEVELS = 4;

export const COMPOSITE_OPERATIONS = [
  "source-over",
  "source-in",
  "source-out",
  "source-atop",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];
