import { isMobile } from "./deviceDetection";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "./constants";

async function setupCamera(videoElement) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const devices = await navigator.mediaDevices.enumerateDevices();

  const usbWebcamDevice = devices.find(
    d => d.kind === "videoinput" && d.label !== "FaceTime HD Camera"
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
  recordVideo(loadedVideo.srcObject);
  loadedVideo.play();

  return loadedVideo;
}

async function recordVideo(stream) {
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  console.log("started recording");

  let chunks = [];

  mediaRecorder.ondataavailable = e => {
    if (event.data.size > 0) {
      chunks.push(e.data);
    } else {
      ///
    }
  };

  mediaRecorder.onstop = async () => {
    console.log("stopped recording");
    // if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    //   options = {mimeType: 'video/webm; codecs=vp9'};
    // } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    //   options = {mimeType: 'video/webm; codecs=vp8'};
    // } else {
    //   // ...
    // }
    const blob = new Blob(chunks, { type: "video/webm; codecs=vp9" });
    chunks = [];
    const videoUrl = window.URL.createObjectURL(blob);
    const videoPlaybackElement = document.createElement("video");
    videoPlaybackElement.src = videoUrl;
    document.body.append(videoPlaybackElement);
  };

  await new Promise(resolve => setTimeout(resolve, 10000));

  mediaRecorder.stop();
}
