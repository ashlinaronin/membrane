<template>
  <div class="video-score">
    <video playsinline ref="video" />
    <canvas ref="output" />
    <ErrorDisplay :message="{ error }" />
  </div>
</template>

<script>
import * as posenet from "@tensorflow-models/posenet";
import Stats from "stats.js";

import ErrorDisplay from "./ErrorDisplay.vue";

import { loadVideo } from "../library/webcam";
import { detectPoseInRealTime } from "../library/poseDetectionManager";

export default {
  name: "VideoScore",
  components: {
    ErrorDisplay
  },
  data() {
    return {
      error: "",
      net: null,
      stats: new Stats()
    };
  },
  async mounted() {
    // these values are optimized for the best possible performance with the models available
    this.net = await posenet.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: 161,
      multiplier: 0.5,
      quantBytes: 2
    });

    try {
      await loadVideo(this.$refs.video);
      detectPoseInRealTime(
        this.$refs.output,
        this.$refs.video,
        this.net,
        this.stats
      );

      // Show stats panel if we are running in local development environment
      if (location.hostname === "localhost") {
        document.body.appendChild(this.stats.dom);
      }
    } catch (e) {
      console.error(e);
      this.error =
        "this browser does not support video capture, or this device does not have a camera. " +
        "please try using Chrome or Firefox on desktop.";
    }
  }
};
</script>

<style scoped lang="scss">
video {
  display: none;
}

canvas {
  width: 100%;
  cursor: none;

  @media only screen and (min-width: 768px) {
    width: auto;
  }
}

.video-score {
  flex: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
