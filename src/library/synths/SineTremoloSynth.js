import Tone from "tone";
import mapRange from "../mapRange";

export default class SineTremoloSynth {
  constructor() {
    this.osc = new Tone.Oscillator(180, "sine");
    this.freqLfo = new Tone.LFO(10, 180, 260);
    this.env = new Tone.AmplitudeEnvelope(0.4, 0.2, 1.0, 0.9);
    this.chorus = new Tone.Chorus(1.5, 3.5, 0.7);
    this.initialize();
  }

  async initialize() {
    this.osc.volume.value = -8;
    this.osc.start();
    this.freqLfo.start();
    this.osc.connect(this.env);
    this.env.connect(this.chorus);
    this.chorus.spread = 180;
    this.chorus.toMaster();
    this.freqLfo.connect(this.osc.frequency);
  }

  dispose() {
    this.osc.dispose();
    this.env.dispose();
    this.chorus.dispose();
    this.freqLfo.dispose();
    this.osc = null;
    this.env = null;
    this.chorus = null;
    this.freqLfo = null;
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.freqLfo.frequency.rampTo(mapRange(x, 0, width, 0.1, 20.0), 0.05);
    this.chorus.frequency.rampTo(mapRange(y, 0, height, 0.1, 20.0), 0.05);
  }
}
