<template>
  <div class="recording-controls">
    <button @click="buttonAction">{{ buttonText }}</button>
  </div>
</template>

<script>
import { startRecording, stopRecording } from "../library/webcam";

export default {
  name: "RecordingControls",
  data() {
    return {
      isRecording: false
    };
  },
  computed: {
    buttonAction() {
      return this.isRecording ? this.stop : this.record;
    },
    buttonText() {
      return this.isRecording ? "stop" : "record";
    }
  },
  methods: {
    record() {
      this.isRecording = true;
      startRecording();
    },
    stop() {
      this.isRecording = false;
      stopRecording();
    }
  }
};
</script>

<style lang="scss" scoped>
.recording-controls {
  flex: 1;
}

button {
  background: white;
  border: 1px solid black;
  font-size: 24px;
  margin: 20px;
}
</style>
