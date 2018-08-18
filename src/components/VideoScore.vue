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

import { loadVideo } from "../library/webcam";
import { detectPoseInRealTime } from "../library/scoreManager";
import { MOBILENET_ARCHITECTURE } from "../library/constants";

export default {
  name: "VideoScore",
  props: {
    msg: String
  },
  data() {
    return {
      error: "",
      net: null
    };
  },
  async mounted() {
    // TODO: optimize by putting this in created hook?
    this.net = await posenet.load(MOBILENET_ARCHITECTURE);

    try {
      await loadVideo(this.$refs.video);
      detectPoseInRealTime(this.$refs.output, this.$refs.video, this.net);
    } catch (e) {
      this.error =
        "this browser does not support video capture, or this device does not have a camera";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
