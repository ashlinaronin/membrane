<template>
  <div class="home">
    <VideoScore />
    <FullScreenButton v-show="!fullscreen" />
  </div>
</template>

<script>
import { changeScoreByName } from "../library/scores/scoreManager";
import { changeSynthByName } from "../library/synths/synthManager";
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
  },
  mounted() {
    changeScoreByName("freeze-fragment");
    changeSynthByName("rock-scrape");
    this.$store.commit("SET_AUDIO_DISABLED", {
      audioDisabled: this.$route.query && this.$route.query.audioDisabled
    });
  }
};
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}
</style>
