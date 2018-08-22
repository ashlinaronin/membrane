import LowPulseSynth from "./LowPulseSynth";
import FatSynth from "./FatSynth";
import SneezeSampler from "./SneezeSampler";
import SineTremoloSynth from "./SineTremoloSynth";
import DetunedChordSynth from "./DetunedChordSynth";
import OrganArpeggioSynth from "./OrganArpeggioSynth";

const synthLevelMap = {
  1: OrganArpeggioSynth,
  2: DetunedChordSynth,
  3: SineTremoloSynth,
  4: SneezeSampler,
  5: FatSynth,
  6: LowPulseSynth
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
