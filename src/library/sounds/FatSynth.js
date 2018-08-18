import Tone from "tone";
import mapRange from "../mapRange";

export default class FatSynth {
  constructor() {
    this.osc = new Tone.FatOscillator(80, "sawtooth");
    this.env = new Tone.AmplitudeEnvelope();
    this.initialize();
  }

  async initialize() {
    this.osc.start();
    this.osc.connect(this.env);
    this.env.toMaster();
  }

  dispose() {
    this.osc.dispose();
    this.env.dispose();
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.osc.spread = mapRange(x, 0, width, 0, 20);
    this.osc.detune.value = mapRange(y, 0, height, 50.0, -50.0);
  }
}
