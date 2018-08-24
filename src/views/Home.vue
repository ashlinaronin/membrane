<template>
  <div class="home">
    <VideoScore />
    <LevelControls />
    <FullScreenButton element-selector=".video-score" />
  </div>
</template>

<script>
// @ is an alias to /src
import VideoScore from "@/components/VideoScore.vue";
import LevelControls from "@/components/LevelControls.vue";
import FullScreenButton from "@/components/FullScreenButton.vue";

export default {
  name: "home",
  components: {
    VideoScore,
    LevelControls,
    FullScreenButton
  }
};
</script>
