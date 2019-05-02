<template>
  <div class="recording-controls">
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
  </div>
</template>

<script>
import { startRecording, stopRecording } from "../library/webcam";

export default {
  name: "RecordingControls",
  methods: {
    startRecording,
    stopRecording
  }
};
</script>

<style scoped lang="scss"></style>
