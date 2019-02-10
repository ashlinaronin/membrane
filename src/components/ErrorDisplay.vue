<template>
  <div class="error-display">Error: {{ message.error }}</div>
</template>

<script>
export default {
  name: "ErrorDisplay",
  props: {
    message: String
  }
};
</script>

<style scoped lang="scss">
.error-display {
  color: red;
  max-width: 60%;
}
</style>
