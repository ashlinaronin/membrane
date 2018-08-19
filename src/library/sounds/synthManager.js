import LowPulseSynth from "./LowPulseSynth";
import FatSynth from "./FatSynth";

const synthLevelMap = {
  1: LowPulseSynth,
  2: FatSynth
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
