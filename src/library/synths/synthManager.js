import store from "../../store";

let synth;

export function changeSynthByClass(SynthClassToCreate) {
  if (synth instanceof SynthClassToCreate) {
    // don't re-create the same synth... can cause memory issues and was
    // also causing a strange volume issue in RockScrapeSampler
    return;
  }

  if (typeof synth !== "undefined") {
    synth.dispose();
  }

  if (store.state.audioDisabled) {
    return;
  }

  synth = new SynthClassToCreate();
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
