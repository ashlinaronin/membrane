import store from "../../store";

let synth;

export function changeSynthByClass(SynthClassToCreate) {
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
