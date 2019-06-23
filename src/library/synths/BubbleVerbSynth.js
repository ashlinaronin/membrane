import Tone from "tone";
import mapRange from "../mapRange";

export default class BubbleVerbSynth {
  constructor() {
    this.osc = new Tone.Oscillator(40, "sine");
    this.noise = new Tone.Noise("white");
    this.ampEnv = new Tone.AmplitudeEnvelope({
      attack: 0.3,
      decay: 0.5,
      sustain: 0,
      release: 0.01
    });
    this.lowpass = new Tone.Filter(800, "lowpass");
    this.freqEnv = new Tone.FrequencyEnvelope({
      attack: 3,
      decay: 1,
      sustain: 0,
      release: 0.4,
      baseFrequency: 400
    });
    this.dist = new Tone.Distortion(0.8);
    this.verb = new Tone.JCReverb(0.7);
    this.panner = new Tone.Panner();
    this.initialize();
  }

  async initialize() {
    this.osc.start();
    this.osc.connect(this.lowpass);
    this.noise.start();
    this.noise.connect(this.lowpass);
    this.lowpass.connect(this.ampEnv);
    this.freqEnv.connect(this.osc.frequency);
    this.freqEnv.connect(this.lowpass.frequency);
    this.ampEnv.chain(this.dist, this.verb, this.panner, Tone.Master);
  }

  dispose() {
    this.osc.dispose();
    this.ampEnv.dispose();
    this.lowpass.dispose();
    this.freqEnv.dispose();
    this.verb.dispose();
    this.dist.dispose();
    this.noise.dispose();
    this.panner.dispose();
    this.osc = null;
    this.ampEnv = null;
    this.lowpass = null;
    this.freqEnv = null;
    this.verb = null;
    this.noise = null;
    this.dist = null;
    this.panner = null;
  }

  startNote() {
    this.ampEnv.triggerAttack("+0.05");
    this.freqEnv.triggerAttack("+0.05");
  }

  endNote() {
    this.ampEnv.triggerRelease("+0.05");
    this.freqEnv.triggerRelease("+0.05");
  }

  // eslint-disable-next-line no-unused-vars
  changeParam(x, y, width, height) {
    this.panner.pan.value = mapRange(x, 0, width, -1.0, 1.0);
    this.freqEnv.attack = mapRange(y, 0, height, 0.1, 6);
  }
}
