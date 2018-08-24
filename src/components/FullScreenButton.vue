<template>
  <div class="full-screen-button">
    <button @click="toggleFullscreenMode">{{ buttonText }}</button>
  </div>
</template>

<script>
import fscreen from "fscreen";

export default {
  name: "FullScreenButton",
  data() {
    return {
      fullscreen: false
    };
  },
  computed: {
    buttonText() {
      return this.fullscreen ? "Exit full screen" : "Enter full screen";
    }
  },
  mounted() {
    if (fscreen.fullscreenEnabled) {
      fscreen.addEventListener(
        "fullscreenchange",
        this.handleFullscreenChange,
        false
      );
      fscreen.addEventListener(
        "fullscreenerror",
        this.handleFullscreenError,
        false
      );
    }
  },
  methods: {
    toggleFullscreenMode() {
      if (fscreen.fullscreenElement === null) {
        fscreen.requestFullscreen(document.body);
      } else {
        fscreen.exitFullscreen();
      }
    },
    handleFullscreenChange() {
      this.fullscreen = fscreen.fullscreenElement !== null;
    },
    handleFullscreenError(err) {
      console.error("Fullscreen error", err);
    }
  },
  beforeDestroy() {
    fscreen.removeEventListener(
      "fullscreenchange",
      this.handleFullscreenChange
    );
    fscreen.removeEventListener("fullscreenerror", this.handleFullscreenError);
  }
};
</script>

<style scoped lang="scss">
</style>
