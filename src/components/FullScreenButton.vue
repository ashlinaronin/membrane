<template>
  <div class="full-screen-button">
    <button @click="doFscreen">full screen</button>
  </div>
</template>

<script>
import fscreen from "fscreen";

export default {
  name: "FullScreenButton",
  props: {
    elementSelector: String
  },
  methods: {
    doFscreen() {
      if (fscreen.fullscreenEnabled) {
        fscreen.addEventListener(
          "fullscreenchange",
          this.fullscreenHandler,
          false
        );
        const $el = document.querySelector(this.elementSelector);
        fscreen.requestFullscreen($el);
      }
    },
    fullscreenHandler() {
      if (fscreen.fullscreenElement !== null) {
        console.log("Entered fullscreen mode");
      } else {
        console.log("Exited fullscreen mode");
      }
    }
  },
  beforeDestroy() {
    fscreen.removeEventListener("fullscreenchange", this.fullscreenHandler);
  }
};
</script>

<style scoped lang="scss">
</style>
