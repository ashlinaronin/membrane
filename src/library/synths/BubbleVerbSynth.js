import Tone from "tone";
import mapRange from "../mapRange";

export default class BubbleVerbSynth {
  constructor() {
    this.osc = new Tone.Oscillator(440, "sine");
    this.ampEnv = new Tone.AmplitudeEnvelope();
    this.lowpass = new Tone.Filter(200, "lowpass");
    this.freqEnv = new Tone.FrequencyEnvelope({
      attack: 0.01,
      decay: 1.03,
      sustain: 0,
      release: 0.01
    });
    this.verb = new Tone.Freeverb(0.2, 5000);
    this.initialize();
  }

  async initialize() {
    this.osc.start();
    this.osc.connect(this.lowpass);
    this.lowpass.connect(this.ampEnv);
    this.freqEnv.connect(this.osc.frequency);
    this.freqEnv.connect(this.lowpass.frequency);

    this.ampEnv.toMaster();

    // this.ampEnv.connect(this.verb);
    // this.verb.toMaster();
  }

  dispose() {
    this.osc.dispose();
    this.ampEnv.dispose();
    this.lowpass.dispose();
    this.freqEnv.dispose();
    this.verb.dispose();
    this.osc = null;
    this.ampEnv = null;
    this.lowpass = null;
    this.freqEnv = null;
    this.verb = null;
  }

  startNote() {
    this.ampEnv.triggerAttack("+0.05", 0.8);
    this.freqEnv.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.ampEnv.triggerRelease("+0.05");
    this.freqEnv.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    // this.osc.frequency.value = mapRange(x, 0, width, 0.8, 1.0);
    this.osc.detune.value = mapRange(y, 0, height, 50.0, -50.0);
  }
}
