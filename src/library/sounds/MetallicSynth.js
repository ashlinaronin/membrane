import Tone from "tone";
import mapRange from "../mapRange";

export default class MetallicSynth {
  constructor() {
    this.synth = new Tone.MetalSynth();
    this.initialize();
  }

  async initialize() {
    this.synth.envelope.decay = 1.2;
    this.synth.envelope.release = 0.4;
    this.synth.envelope.sustain = 1.0;
    this.synth.envelope.releaseCurve = "exponential";
    this.synth.toMaster();
  }

  dispose() {
    this.synth.dispose();
    this.synth = null;
  }

  startNote() {
    this.synth.triggerAttack("+0.01", 0.8);
  }

  endNote() {
    this.synth.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.synth.frequency.rampTo(mapRange(x, 0, width, 200, 400), 0.1);
    this.synth.harmonicity = mapRange(y, 0, height, 0.25, 40.0);
    this.synth.modulationIndex = mapRange(x, 0, width, 1, 10);
  }
}
