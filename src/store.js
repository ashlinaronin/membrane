import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    level: 0
  },
  mutations: {
    LEVEL_UP(state) {
      state.level++;
    }
  },
  actions: {}
});
