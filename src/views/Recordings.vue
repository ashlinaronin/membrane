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
import video1 from "../assets/recordings/membrane-1558972965427.webm";
import video2 from "../assets/recordings/membrane-1558674661992.webm";
import video4 from "../assets/recordings/membrane-1559002595970.webm";
import video5 from "../assets/recordings/membrane-1559135941431.webm";
import video6 from "../assets/recordings/video-1559015836.mp4";
import video7 from "../assets/recordings/video-1559057469.mp4";

export default {
  data() {
    return {
      videos: [video1, video2, video4, video5, video6, video7]
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
