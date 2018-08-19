import Vue from "vue";
import Vuex from "vuex";
import { changeLevel as changeSynthLevel } from "./library/sounds/synthManager";
import { changeLevel as changeScoreLevel } from "./library/scores/scoreManager";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    level: 0
  },
  mutations: {
    LEVEL_UP(state) {
      state.level++;
      changeSynthLevel(state.level);
      changeScoreLevel(state.level);
    }
  },
  actions: {}
});
