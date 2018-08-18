export const VIDEO_WIDTH = 640;
export const VIDEO_HEIGHT = 480;
export const MAP_RESOLUTION = 8;
export const MOBILENET_ARCHITECTURE = 0.5;

// look for this webcam, if not found use default
export const EXTERNAL_WEBCAM_LABEL = "USB Camera (046d:0821)";

export const MULTI_POSE_CONFIG = {
  MAX_POSE_DETECTIONS: 5,
  MIN_POSE_CONFIDENCE: 0.15,
  MIN_PART_CONFIDENCE: 0.1,
  NMS_RADIUS: 30.0
};

export const FLIP_HORIZONTAL = true;
export const IMAGE_SCALE_FACTOR = 0.5;
export const OUTPUT_STRIDE = 16;
