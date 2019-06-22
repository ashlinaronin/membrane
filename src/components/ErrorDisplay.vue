<template>
  <div v-if="message.error.length > 0" class="error-display">
    error: {{ message.error }}
  </div>
</template>

<script>
export default {
  name: "ErrorDisplay",
  props: {
    message: {
      type: Object,
      default: function() {
        return { message: "" };
      }
    }
  }
};
</script>

<style scoped lang="scss">
.error-display {
  color: red;
  max-width: 60%;
}
</style>
