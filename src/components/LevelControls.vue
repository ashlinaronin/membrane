<template>
  <div class="level-controls">
    <label for="selected-level">Select level</label>
    <select name="selectedLevel" id="selected-level" v-model="selectedLevel">
      <option v-for="level in availableLevels"
              :key="level"
              :value="level">{{level}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "LevelControls",
  data() {
    return {
      availableLevels: Array.from({ length: 10 }, (v, k) => k + 1)
    };
  },
  computed: {
    selectedLevel: {
      get() {
        return this.$store.state.level;
      },
      set(newLevel) {
        this.$store.commit("CHANGE_LEVEL", { level: newLevel });
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
