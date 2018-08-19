<template>
  <div class="level-controls">
    <label for="selected-level">Select level</label>
    <select name="selectedLevel" id="selected-level" v-model="selectedLevel" @change="handleSelectedLevelChange">
      <option v-for="level in AVAILABLE_LEVELS"
              :key="level"
              :value="level">{{level}}</option>
    </select>
  </div>
</template>

<script>
const AVAILABLE_LEVELS = Array.from({ length: 10 }, (v, k) => k + 1);

export default {
  name: "LevelControls",
  data() {
    return {
      selectedLevel: this.$store.state.level,
      AVAILABLE_LEVELS
    };
  },
  methods: {
    handleSelectedLevelChange(event) {
      this.$store.commit("CHANGE_LEVEL", { level: Number(event.target.value) });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
