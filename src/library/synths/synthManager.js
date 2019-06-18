import LowPulseSynth from "./LowPulseSynth";
import SneezeSampler from "./SneezeSampler";
import SineTremoloSynth from "./SineTremoloSynth";
import MetallicSynth from "./MetallicSynth";
import store from "../../store";

const synthLevelMap = {
  1: MetallicSynth,
  2: LowPulseSynth,
  3: SneezeSampler,
  4: SineTremoloSynth
};

let synth;

changeLevel(1);

export function changeSynthByClass(SynthClassToCreate) {
  if (typeof synth !== "undefined") {
    synth.dispose();
  }

  if (store.state.audioDisabled) {
    return;
  }

  synth = new SynthClassToCreate();
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
