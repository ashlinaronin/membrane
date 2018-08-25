import Tone from "tone";
import mapRange from "../mapRange";

export default class MetallicSynth {
  constructor() {
    this.synth = new Tone.MetalSynth();
    this.delay = new Tone.FeedbackDelay("8n", 0.4);
    this.initialize();
  }

  async initialize() {
    this.synth.envelope.decay = 1.2;
    this.synth.envelope.release = 0.4;
    this.synth.envelope.sustain = 1.0;
    this.synth.envelope.releaseCurve = "exponential";
    this.synth.frequency.value = 80;
    this.synth.connect(this.delay);
    this.delay.toMaster();
  }

  dispose() {
    this.synth.dispose();
    this.delay.dispose();
    this.synth = null;
    this.delay = null;
  }

  startNote() {
    this.synth.triggerAttack("+0.01", 0.8);
  }

  endNote() {
    this.synth.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.synth.harmonicity = mapRange(y, 0, height, 0.25, 40.0);
    this.synth.modulationIndex = mapRange(x, 0, width, 1, 10);
  }
}
