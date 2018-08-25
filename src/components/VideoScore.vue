<template>
  <div class="video-score">
    <video playsinline ref="video"></video>
    <canvas ref="output"></canvas>
    <div class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import * as posenet from "@tensorflow-models/posenet";
import Stats from "stats.js";

import { loadVideo } from "../library/webcam";
import { detectPoseInRealTime } from "../library/poseDetectionManager";
import { MOBILENET_ARCHITECTURE } from "../library/constants";

export default {
  name: "VideoScore",
  data() {
    return {
      error: "",
      net: null,
      stats: new Stats()
    };
  },
  async mounted() {
    // TODO: optimize by putting this in created hook?
    this.net = await posenet.load(MOBILENET_ARCHITECTURE);
    //    this.stats.showPanel(0);
    //    document.body.appendChild(this.stats.dom);

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
        "this browser does not support video capture, or this device does not have a camera";
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
