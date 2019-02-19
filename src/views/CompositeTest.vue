<template>
  <div class="composite-test">
    <video playsinline ref="video" />
    <canvas ref="output" />
    <ul>
      <li
        v-for="(operation, index) in operations"
        :key="`${operation}-${index}`"
      >
        <OperationSelector
          :selected-operation="operation"
          :index="index"
          :on-change-operation="handleChangeOperation"
        />
      </li>
    </ul>
    <ErrorDisplay :message="{ error }" />
  </div>
</template>

<script>
import VideoScore from "@/components/VideoScore.vue";
import OperationSelector from "@/components/OperationSelector.vue";
import ErrorDisplay from "@/components/ErrorDisplay.vue";
import { loadVideo } from "../library/webcam";
import { drawMirroredVideo } from "../library/scores/scoreHelpers";

export default {
  name: "CompositeTest",
  components: {
    VideoScore,
    OperationSelector,
    ErrorDisplay
  },
  data() {
    return {
      error: "",
      operations: ["source-over", "source-atop", "hue", "source-over"],
      ctx: null,
      videoWidth: 640,
      videoHeight: 480
    };
  },
  methods: {
    handleChangeOperation(tag, newValue) {
      this.operations[Number(tag)] = newValue;
    },
    render() {
      console.log("render");

      this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
      this.ctx.globalCompositeOperation = this.operations[0];

      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.videoWidth, this.videoHeight);

      this.ctx.globalCompositeOperation = this.operations[1];

      drawMirroredVideo(
        this.ctx,
        this.$refs.video,
        this.videoWidth,
        this.videoHeight
      );

      this.ctx.globalCompositeOperation = this.operations[2];

      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.videoWidth / 2, this.videoHeight / 2);

      this.ctx.globalCompositeOperation = this.operations[3];

      requestAnimationFrame(this.render);
    }
  },
  async mounted() {
    try {
      await loadVideo(this.$refs.video);
      this.ctx = this.$refs.output.getContext("2d");
      this.render();
    } catch (e) {
      console.error(e);
      this.error = "Error, sry";
    }
  }
};
</script>

<style scoped lang="scss">
.composite-test {
  background: red;
}

video {
  display: none;
}

canvas {
  width: 100%;
  cursor: none;

  @media only screen and (min-width: 768px) {
    /*width: auto;*/
    width: 640px;
    height: 480px;
  }
}
</style>
