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
import { MOBILENET_ARCHITECTURE } from "../library/constants";

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
    this.net = await posenet.load(MOBILENET_ARCHITECTURE);

    try {
      await loadVideo(this.$refs.video);
      detectPoseInRealTime(
        this.$refs.output,
        this.$refs.video,
        this.net,
        this.stats
      );
    } catch (e) {
      this.error =
        "this browser does not support video capture, or this device does not have a camera.";
    }
  }
};
</script>

<style scoped lang="scss">
video {
  display: none;
}

canvas {
  cursor: none;
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
