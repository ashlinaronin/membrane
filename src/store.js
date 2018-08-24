import Vue from "vue";
import Vuex from "vuex";
import { changeLevel as changeSynthLevel } from "./library/sounds/synthManager";
import { changeLevel as changeScoreLevel } from "./library/scores/scoreManager";
import { NUM_LEVELS } from "./library/constants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    level: 1
  },
  mutations: {
    LEVEL_UP(state) {
      if (state.level === NUM_LEVELS) {
        state.level = 1;
      } else {
        state.level++;
      }

      updateSynthAndScore(state.level);
    },
    CHANGE_LEVEL(state, { level }) {
      state.level = level;
      updateSynthAndScore(state.level);
    }
  },
  actions: {}
});

function updateSynthAndScore(newLevel) {
  changeSynthLevel(newLevel);
  changeScoreLevel(newLevel);
}
