<template>
  <div class="home">
    <VideoScore />
    <LevelControls />
  </div>
</template>

<script>
// @ is an alias to /src
import VideoScore from "@/components/VideoScore.vue";
import LevelControls from "@/components/LevelControls.vue";

export default {
  name: "home",
  components: {
    VideoScore,
    LevelControls
  }
};
</script>
