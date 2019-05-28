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
import test1 from "../assets/recordings/membrane-1558972965427.webm";
import test2 from "../assets/recordings/membrane-1558674661992.webm";
import test3 from "../assets/recordings/membrane-1559008454578.webm";
import test4 from "../assets/recordings/membrane-1559002595970.webm";

export default {
  data() {
    return {
      videos: [test1, test2, test3, test4]
    };
  }
};
</script>

<style lang="scss">
.recordings {
  display: flex;
}

.video-list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    align-self: flex-start;
  }

  video {
    width: 200px;
  }

  div {
    width: 200px;
    background: red;
  }
}
</style>
