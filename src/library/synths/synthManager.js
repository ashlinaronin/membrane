import LowPulseSynth from "./LowPulseSynth";
import SneezeSampler from "./SneezeSampler";
import SineTremoloSynth from "./SineTremoloSynth";
import RockScrapeSampler from "./RockScrapeSampler";
import MetallicSynth from "./MetallicSynth";
import BubbleVerbSynth from "./BubbleVerbSynth";
import store from "../../store";

const synthLevelMap = {
  1: MetallicSynth,
  2: LowPulseSynth,
  3: SneezeSampler,
  4: SineTremoloSynth
};

const synthNameMap = {
  default: MetallicSynth,
  "rock-scrape": RockScrapeSampler,
  "bubble-verb": BubbleVerbSynth
};

let synth;

changeLevel(1);

export function changeSynthByName(name) {
  if (typeof synth !== "undefined") {
    synth.dispose();
  }

  if (store.state.audioDisabled) {
    return;
  }

  const synthType = synthNameMap.hasOwnProperty(name)
    ? synthNameMap[name]
    : synthNameMap.default;
  synth = new synthType();
}

export function changeLevel(level) {
  if (typeof synth !== "undefined") {
    synth.dispose();
  }

  if (store.state.audioDisabled) {
    return;
  }

  const synthType = synthLevelMap.hasOwnProperty(level)
    ? synthLevelMap[level]
    : synthLevelMap[1];
  synth = new synthType();
}

export function startNote() {
  if (store.state.audioDisabled) {
    return;
  }

  return synth.startNote();
}

export function endNote() {
  if (store.state.audioDisabled) {
    return;
  }

  return synth.endNote();
}

export function changeParam(x, y, width, height) {
  if (store.state.audioDisabled) {
    return;
  }

  return synth.changeParam(x, y, width, height);
}
