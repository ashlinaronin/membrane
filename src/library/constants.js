export const VIDEO_WIDTH = 640;
export const VIDEO_HEIGHT = 480;
export const SCORE_RESOLUTION = 8;
export const MOBILENET_ARCHITECTURE = 0.5;

// look for this webcam, if not found use default
export const EXTERNAL_WEBCAM_LABEL = "USB Camera (046d:0990)";

export const MULTI_POSE_CONFIG = {
  MAX_POSE_DETECTIONS: 5,
  MIN_POSE_CONFIDENCE: 0.15,
  MIN_PART_CONFIDENCE: 0.1,
  NMS_RADIUS: 30.0
};

export const FLIP_HORIZONTAL = true;
export const IMAGE_SCALE_FACTOR = 0.2;
export const OUTPUT_STRIDE = 16;

export const MIN_DISTANCE_TO_PLAY = 16;
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
