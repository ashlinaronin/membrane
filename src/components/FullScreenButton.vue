<template>
  <div class="full-screen-button">
    <button @click="toggleFullscreenMode">{{ buttonText }}</button>
  </div>
</template>

<script>
import fscreen from "fscreen";

export default {
  name: "FullScreenButton",
  computed: {
    buttonText() {
      return this.fullscreen ? "Exit full screen" : "Enter full screen";
    },
    fullscreen: {
      get() {
        return this.$store.state.fullscreen;
      },
      set(newVal) {
        this.$store.commit("SET_FULLSCREEN", { fullscreen: newVal });
      }
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

<style lang="scss" scoped>
button {
  background: white;
  border: 1px solid black;
  font-size: 24px;
  margin: 20px;
}
</style>
