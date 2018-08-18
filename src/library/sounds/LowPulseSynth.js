import Tone from "tone";
import mapRange from "../mapRange";

export default class LowPulseSynth {
  constructor() {
    this.reverb = new Tone.Reverb(2.5);
    this.osc = new Tone.PulseOscillator(80, 0.2);
    this.env = new Tone.AmplitudeEnvelope();
    this.initialize();
  }

  async initialize() {
    // generate impulse response for verb, then connect modules
    await this.reverb.generate();
    this.osc.start();
    this.osc.connect(this.env);
    this.env.connect(this.reverb);
    this.reverb.toMaster();
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.osc.width.value = mapRange(x, 0, width, 0, 1.0);
    this.osc.detune.value = mapRange(y, 0, height, 50.0, -50.0);
  }
}
