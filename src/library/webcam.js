import { isMobile } from "./deviceDetection";
import { VIDEO_WIDTH, VIDEO_HEIGHT, EXTERNAL_WEBCAM_LABEL } from "./constants";

async function setupCamera(videoElement) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const usbWebcamDevice = devices.find(
    d => d.kind === "videoinput" && d.label === EXTERNAL_WEBCAM_LABEL
  );
  const mobile = isMobile();

  const constraints = {
    audio: false,
    video: {
      width: mobile ? undefined : VIDEO_WIDTH,
      height: mobile ? undefined : VIDEO_HEIGHT,
      deviceId: usbWebcamDevice ? usbWebcamDevice.deviceId : undefined
    }
  };

  videoElement.width = VIDEO_WIDTH;
  videoElement.height = VIDEO_HEIGHT;
  videoElement.srcObject = await navigator.mediaDevices.getUserMedia(
    constraints
  );

  return new Promise(resolve => {
    videoElement.onloadedmetadata = () => {
      resolve(videoElement);
    };
  });
}

export async function loadVideo(videoElement) {
  const loadedVideo = await setupCamera(videoElement);
  loadedVideo.play();

  return loadedVideo;
}
