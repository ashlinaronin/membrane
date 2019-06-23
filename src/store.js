import Vue from "vue";
import Vuex from "vuex";
import { changeSynthByClass } from "./library/synths/synthManager";
import { changeScoreByClass } from "./library/scores/scoreManager";
import performers from "./library/sequence";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    level: 0,
    audioDisabled: false,
    fullscreen: false,
    performer: null,
    performerLevelCount: 0
  },
  mutations: {
    INCREMENT_LEVEL(state) {
      state.level = (state.level + 1) % state.performerLevelCount;
    },
    SET_LEVEL(state, { level }) {
      state.level = level % state.performerLevelCount;
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
      const foundPerformer = Object.keys(performers).find(
        name => name === performer
      );

      const performerOrDefault = foundPerformer || "default";

      commit("SET_PERFORMER", {
        performer: performerOrDefault
      });

      const performerData = performers[performerOrDefault];
      commit("SET_PERFORMER_LEVEL_COUNT", {
        performerLevelCount: performerData.length
      });

      const firstPerformerScoreAndSynth = performerData[0];
      changeScoreByClass(firstPerformerScoreAndSynth.score);
      changeSynthByClass(firstPerformerScoreAndSynth.synth);
    },
    GO_TO_NEXT_LEVEL({ commit, state }) {
      commit("INCREMENT_LEVEL");

      const performerData = performers[state.performer];
      const newLevel = performerData[state.level];
      changeScoreByClass(newLevel.score);
      changeSynthByClass(newLevel.synth);
    },
    // keeping around for testing with LevelSelector, not used by production code
    CHANGE_LEVEL({ commit, state }, level) {
      commit("SET_LEVEL", { level });

      const performerData = performers[state.performer];
      const newLevel = performerData[state.level];
      changeScoreByClass(newLevel.score);
      changeSynthByClass(newLevel.synth);
    }
  }
});
