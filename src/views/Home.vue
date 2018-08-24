<template>
  <div class="home">
    <VideoScore />
    <LevelControls v-show="!fullscreen" />
    <FullScreenButton v-show="!fullscreen" />
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
  },
  computed: {
    fullscreen() {
      return this.$store.state.fullscreen;
    }
  }
};
</script>
