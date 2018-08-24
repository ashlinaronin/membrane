import Tone from "tone";
import mapRange from "../mapRange";

export default class FatSynth {
  constructor() {
    this.osc = new Tone.FatOscillator(80, "sawtooth");
    this.env = new Tone.AmplitudeEnvelope();
    this.delay = new Tone.PingPongDelay(0.1, 0.1);
    this.initialize();
  }

  async initialize() {
    this.osc.start();
    this.osc.connect(this.env);
    this.env.connect(this.delay);
    this.delay.toMaster();
  }

  dispose() {
    this.osc.dispose();
    this.env.dispose();
    this.delay.dispose();
    this.osc = null;
    this.env = null;
    this.delay = null;
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.osc.spread = mapRange(x, 0, width, 0, 20);

    const detune = mapRange(y, 0, height, 75.0, -75.0);
    this.osc.detune.rampTo(detune);
  }
}
