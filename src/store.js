import Vue from "vue";
import Vuex from "vuex";
import {
  changeLevel as changeSynthLevel,
  changeSynthByName
} from "./library/synths/synthManager";
import {
  changeLevel as changeScoreLevel,
  changeScoreByName
} from "./library/scores/scoreManager";
import { performers } from "./library/performers";
import { NUM_LEVELS } from "./library/constants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    level: 1,
    audioDisabled: false,
    fullscreen: false,
    performer: null,
    performerLevelCount: 0
  },
  mutations: {
    INCREMENT_LEVEL(state) {
      const numLevels = state.performer
        ? state.performerLevelCount
        : NUM_LEVELS;
      state.level = (state.level + 1) % numLevels;
    },
    SET_LEVEL(state, { level }) {
      const numLevels = state.performer
        ? state.performerLevelCount
        : NUM_LEVELS;
      state.level = level % numLevels;
    },
    SET_FULLSCREEN(state, { fullscreen }) {
      state.fullscreen = fullscreen;
    },
    SET_AUDIO_DISABLED(state, { audioDisabled }) {
      state.audioDisabled = audioDisabled;
    },
    SET_PERFORMER(state, { performer }) {
      state.performer = performer;
    },
    SET_PERFORMER_LEVEL_COUNT(state, { performerLevelCount }) {
      state.performerLevelCount = performerLevelCount;
    }
  },
  actions: {
    INITIALIZE_PERFORMER({ commit }, performer) {
      commit("SET_PERFORMER", { performer });

      const performerData = performers[performer];
      commit("SET_PERFORMER_LEVEL_COUNT", {
        performerLevelCount: performerData.length
      });

      const firstPerformerScoreAndSynth = performerData[0];
      changeScoreByName(firstPerformerScoreAndSynth.score);
      changeSynthByName(firstPerformerScoreAndSynth.synth);
    },
    GO_TO_NEXT_LEVEL({ commit, state }) {
      commit("INCREMENT_LEVEL");

      if (state.performer) {
        const performerData = performers[state.performer];
        const newLevel = performerData[state.level];
        changeScoreByName(newLevel.score);
        changeSynthByName(newLevel.synth);
      } else {
        changeSynthLevel(state.level);
        changeScoreLevel(state.level);
      }
    },
    CHANGE_LEVEL({ commit, state }, level) {
      commit("SET_LEVEL", { level });
      changeSynthLevel(state.level);
      changeScoreLevel(state.level);
    }
  }
});
