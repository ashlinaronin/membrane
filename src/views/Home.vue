<template>
  <div class="home">
    <VideoScore />
    <RecordingControls v-if="!isDeployedAtPeripheralForms" />
    <div class="instructions">
      <ul>
        <li>works best on a full-sized computer in Chrome or Firefox</li>
        <li>move your nose to play notes</li>
        <li>play all the notes to reach the next stage</li>
        <li>
          see some <router-link to="/recordings">inspiration</router-link>
        </li>
      </ul>
    </div>
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
    },
    isDeployedAtPeripheralForms() {
      return process.env.VUE_APP_DEPLOY_TARGET === "pf";
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

.instructions {
  flex: 1;
  ul {
    text-align: left;
    list-style: none;
  }
}
</style>
