<template>
  <div class="video-score">
    henlo
    <video playsinline ref="video"></video>
    <canvas ref="output"></canvas>
    <div class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { loadVideo } from "../library/webcam";

export default {
  name: "VideoScore",
  props: {
    msg: String
  },
  data() {
    return {
      error: ""
    };
  },
  async mounted() {
    try {
      await loadVideo(this.$refs.video);
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
</style>
