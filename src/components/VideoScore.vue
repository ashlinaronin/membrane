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
  props: {
    msg: String
  },
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
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

video {
  display: none;
}
</style>
