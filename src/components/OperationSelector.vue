<template>
  <div class="operation-selector">
    <label for="selected-operation">Select level</label>
    <select
      name="selectedOperation"
      id="selected-operation"
      :value="selectedOperation"
      @change="changeOp"
    >
      <option
        v-for="operation in availableOperations"
        :key="operation"
        :value="operation"
      >
        {{ operation }}
      </option>
    </select>
  </div>
</template>

<script>
import { COMPOSITE_OPERATIONS } from "../library/constants";

export default {
  name: "OperationSelector",
  data() {
    return {
      availableOperations: COMPOSITE_OPERATIONS
    };
  },
  props: {
    index: Number,
    selectedOperation: String,
    onChangeOperation: Function
  },
  methods: {
    changeOp(event) {
      this.onChangeOperation(this.index, event.target.value);
    }
  }
};
</script>

<style scoped lang="scss"></style>
