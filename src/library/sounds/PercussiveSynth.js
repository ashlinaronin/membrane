import Tone from "tone";
import mapRange from "../mapRange";

export default class PercussiveSynth {
  constructor() {
    this.synth = new Tone.MembraneSynth();
    this.initialize();
  }

  async initialize() {
    this.synth.envelope.decay = 1.8;
    this.synth.envelope.release = 3.0;
    this.synth.envelope.sustain = 1.0;
    this.synth.envelope.releaseCurve = "exponential";
    this.synth.toMaster();
  }

  dispose() {
    this.synth.dispose();
    this.synth = null;
  }

  startNote() {
    this.synth.triggerAttack(
      this.synth.oscillator.frequency.value,
      "+0.01",
      0.8
    );
  }

  endNote() {
    this.synth.triggerRelease("+0.05");
  }

  /* eslint-disable no-unused-vars */
  changeParam(x, y, width, height) {
    this.synth.oscillator.frequency.rampTo(
      mapRange(x, 0, width, 200, 400),
      0.1
    );
  }
}
