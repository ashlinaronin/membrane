import LowPulseSynth from "./LowPulseSynth";
import SneezeSampler from "./SneezeSampler";
import SineTremoloSynth from "./SineTremoloSynth";
import MetallicSynth from "./MetallicSynth";

const synthLevelMap = {
  1: MetallicSynth,
  2: LowPulseSynth,
  3: SneezeSampler,
  4: SineTremoloSynth
};

let synth;

changeLevel(1);

export function changeLevel(level) {
  if (typeof synth !== "undefined") {
    synth.dispose();
  }

  const synthType = synthLevelMap.hasOwnProperty(level)
    ? synthLevelMap[level]
    : synthLevelMap[1];
  synth = new synthType();
}

export function startNote() {
  return synth.startNote();
}

export function endNote() {
  return synth.endNote();
}

export function changeParam(x, y, width, height) {
  return synth.changeParam(x, y, width, height);
}
