<template>
  <div class="home">
    <VideoScore />
    <FullScreenButton v-show="!fullscreen" />
    <RecordingControls />
  </div>
</template>

<script>
import { performers } from "../library/performers";
import { changeScoreByName } from "../library/scores/scoreManager";
import { changeSynthByName } from "../library/synths/synthManager";
// @ is an alias to /src
import VideoScore from "@/components/VideoScore.vue";
import FullScreenButton from "@/components/FullScreenButton.vue";
import RecordingControls from "@/components/RecordingControls.vue";

export default {
  name: "home",
  components: {
    VideoScore,
    FullScreenButton,
    RecordingControls
  },
  computed: {
    fullscreen() {
      return this.$store.state.fullscreen;
    }
  },
  mounted() {
    const performerLevel = this.$route.params.performer
      ? performers[this.$route.params.performer]
      : null;

    if (performerLevel) {
      changeScoreByName(performerLevel.score);
      changeSynthByName(performerLevel.synth);
    }

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
