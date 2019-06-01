import { isMobile } from "./deviceDetection";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "./constants";

let mediaRecorder,
  chunks = [];

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
  createMediaRecorder(loadedVideo.srcObject);
  loadedVideo.play();

  return loadedVideo;
}

export function canRecord() {
  return typeof MediaRecorder !== "undefined";
}

function createMediaRecorder(stream) {
  // bail if we don't have a MediaRecorder (Safari)
  if (!canRecord()) return false;

  // TODO: Create combined stream here including audio output from Tone.js
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = e => {
    if (event.data.size > 0) {
      chunks.push(e.data);
    } else {
      console.log("no data in this chunk for some reason?");
    }
  };

  mediaRecorder.onstop = async () => {
    console.log("stopped recording");
    let options;
    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      options = { mimeType: "video/webm; codecs=vp9" };
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      options = { mimeType: "video/webm; codecs=vp8" };
    } else {
      throw new Error("VP8/VP9 not supported, dunno how I can download :(");
    }
    const blob = new Blob(chunks, options);
    chunks = [];
    downloadVideo(blob);
  };
}

export async function startRecording() {
  mediaRecorder && mediaRecorder.start();
  console.log("started recording");
}

export function stopRecording() {
  mediaRecorder && mediaRecorder.stop();
}

function downloadVideo(blob) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.style = "display: none";
  link.href = url;
  link.download = `membrane-${Date.now()}.webm`;
  link.click();
  window.URL.revokeObjectURL(url);
}
