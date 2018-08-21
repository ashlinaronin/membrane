import Tone from "tone";
import LowPulseSynth from "./LowPulseSynth";
import FatSynth from "./FatSynth";
import SneezeSampler from "./SneezeSampler";
import SineTremoloSynth from "./SineTremoloSynth";
import DetunedChordSynth from "./DetunedChordSynth";

const synthLevelMap = {
  1: DetunedChordSynth,
  5: SineTremoloSynth,
  2: FatSynth,
  3: SneezeSampler,
  4: LowPulseSynth
};

let synth, masterCompressor, lowBump;

initializeMasterChain();
changeLevel(1);

function initializeMasterChain() {
  masterCompressor = new Tone.Compressor({
    threshold: -6,
    ratio: 3,
    attack: 0.5,
    release: 0.1
  });

  lowBump = new Tone.Filter(200, "lowshelf");

  Tone.Master.chain(lowBump, masterCompressor);
}

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
