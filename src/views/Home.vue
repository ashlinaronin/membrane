<template>
  <div class="home">
    <VideoScore />
    <RecordingControls v-if="!isDeployedAtPeripheralForms" />
    <div class="instructions" v-if="!isPerformer">
      <ul>
        <li>(sound on)</li>
        <li>move your nose to play notes,</li>
        <li>play them all to continue.</li>
        <li>works best on laptop/desktop in Chrome/Firefox.</li>
        <li>&nbsp;</li>
        <li>
          see some <router-link to="/recordings">inspiration</router-link>.
        </li>
        <li>
          by
          <a href="https://ashlin.me" target="_blank" rel="noopener"
            >ashlin aronin</a
          >
          (<a
            href="https://github.com/ashlinaronin/membrane"
            target="_blank"
            rel="noopener"
            >github</a
          >)
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
    },
    isPerformer() {
      return this.$route.params.performer;
    }
  },
  mounted() {
    if (this.$route.params.performer) {
      this.$store.dispatch(
        "INITIALIZE_PERFORMER",
        this.$route.params.performer
      );
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
