import LowPulseSynth from "./LowPulseSynth";

const synth = new LowPulseSynth();

export function startNote() {
  synth.startNote();
}

export function endNote() {
  synth.endNote();
}

export function changeParam(x, y, width, height) {
  synth.changeParam(x, y, width, height);
}
