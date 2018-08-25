import Tone from "tone";
import mapRange from "../mapRange";

export default class SineTremoloSynth {
  constructor() {
    this.osc = new Tone.Oscillator(200, "sine");
    this.freqLfo = new Tone.LFO(10, 200, 400);
    this.detuneLfo = new Tone.LFO(10, -25.0, 25.0);
    this.env = new Tone.AmplitudeEnvelope();
    this.cheb = new Tone.Chebyshev(15);
    this.reverb = new Tone.Reverb(0.5);
    this.initialize();
  }

  async initialize() {
    // generate impulse response for verb, then connect modules
    await this.reverb.generate();
    this.osc.start();
    this.freqLfo.start();
    this.detuneLfo.start();
    this.osc.connect(this.env);
    this.env.connect(this.cheb);
    this.cheb.connect(this.reverb);
    this.reverb.toMaster();
    this.freqLfo.connect(this.osc.frequency);
    this.detuneLfo.connect(this.osc.detune);
  }

  dispose() {
    this.osc.dispose();
    this.env.dispose();
    this.cheb.dispose();
    this.reverb.dispose();
    this.freqLfo.dispose();
    this.detuneLfo.dispose();
    this.osc = null;
    this.env = null;
    this.cheb = null;
    this.reverb = null;
    this.freqLfo = null;
    this.detuneLfo = null;
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.freqLfo.frequency.value = mapRange(x, 0, width, 0, 25.0);
    this.detuneLfo.frequency.value = mapRange(y, 0, height, 0, 10.0);
    this.reverb.wet.value = mapRange(y, 0, height, 0, 1.0);
  }
}
