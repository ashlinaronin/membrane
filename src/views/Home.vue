<template>
  <div class="home">
    <VideoScore />
    <FullScreenButton v-show="!fullscreen" />
  </div>
</template>

<script>
// @ is an alias to /src
import VideoScore from "@/components/VideoScore.vue";
import FullScreenButton from "@/components/FullScreenButton.vue";

export default {
  name: "home",
  components: {
    VideoScore,
    FullScreenButton
  },
  computed: {
    fullscreen() {
      return this.$store.state.fullscreen;
    }
  }
};
</script>
