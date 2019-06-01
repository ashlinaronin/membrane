<template>
  <div class="recordings">
    <ul class="video-list">
      <li v-for="video in videos" :key="video">
        <video autoplay loop>
          <!-- TODO: need to convert webm on backend to other formats for browser compat? -->
          <source :src="video" type="video/webm" />
        </video>
      </li>
    </ul>
  </div>
</template>
<script>
import jacob from "../assets/recordings/membrane-1558972965427.webm";
import deryn from "../assets/recordings/membrane-1558674661992.webm";
import sophia from "../assets/recordings/membrane-1559002595970.webm";
import karen from "../assets/recordings/membrane-1559135941431.webm";
import nora from "../assets/recordings/video-1559015836.mp4";
import peter from "../assets/recordings/video-1559057469.mp4";
import mom from "../assets/recordings/membrane-1559359818610.webm";
import dad from "../assets/recordings/membrane-1559359941872.webm";
import james from "../assets/recordings/membrane-1559417359675.webm";

export default {
  data() {
    return {
      videos: [jacob, james, sophia, karen, nora, peter, mom, dad, deryn]
    };
  }
};
</script>

<style lang="scss">
.recordings {
  display: flex;
  flex-wrap: wrap;
}

.video-list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    flex: 50% 1 0;
  }

  video {
    display: block;
    width: 100%;
  }
}
</style>
