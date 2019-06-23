<template>
  <div class="composite-test">
    <video playsinline ref="video" />
    <canvas ref="output" width="640" height="480" />
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

const generateScore = (width, height) => {
  const grid = [];

  for (let i = 0; i < width; i++) {
    grid[i] = [];
    for (let j = 0; j < height; j++) {
      grid[i][j] = Math.random() >= 0.5;
    }
  }

  return grid;
};

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
      videoHeight: 480,
      grid: generateScore(12, 12),
      widthUnit: 640 / 12,
      heightUnit: 480 / 12
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

      this.drawGrid(this.ctx, "black");

      this.ctx.globalCompositeOperation = this.operations[1];

      drawMirroredVideo(
        this.ctx,
        this.$refs.video,
        this.videoWidth,
        this.videoHeight
      );

      this.ctx.globalCompositeOperation = this.operations[2];

      this.drawGrid(this.ctx, "black");

      this.ctx.globalCompositeOperation = this.operations[3];

      requestAnimationFrame(this.render);
    },
    dispose() {
      this.grid = null;
    },
    drawGrid(ctx, gridFillStyle) {
      ctx.fillStyle = gridFillStyle;
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[0].length; j++) {
          if (this.grid[i][j] === true) {
            ctx.fillRect(
              this.widthUnit * i,
              this.heightUnit * j,
              this.widthUnit,
              this.heightUnit
            );
          }
        }
      }
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
  },
  destroyed() {
    this.dispose();
  }
};
</script>

<style scoped lang="scss">
video {
  display: none;
}
</style>
