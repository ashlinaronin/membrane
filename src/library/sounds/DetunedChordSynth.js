import Tone from "tone";
import mapRange from "../mapRange";

export default class DetunedChordSynth {
  constructor() {
    this.intervals = [0, 4, 5, 9];
    const notes = Tone.Frequency("C2").harmonize(this.intervals);
    this.oscs = notes.map(note => {
      return new Tone.Oscillator(note, "sawtooth6");
    });

    this.env = new Tone.AmplitudeEnvelope();
    this.panner = new Tone.Panner(0);
    this.initialize();
  }

  async initialize() {
    this.oscs.forEach(osc => {
      osc.connect(this.env);
      osc.start();
    });
    this.env.connect(this.panner);
    this.panner.toMaster();
  }

  dispose() {
    this.oscs.forEach(osc => osc.dispose());
    this.panner.dispose();
    this.env.dispose();
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    const firstDistance = mapRange(x, 0, width, 2.0, 12.0);
    const secondDistance = mapRange(y, 0, height, 1.0, 8.0);
    this.intervals = [
      0,
      firstDistance,
      firstDistance + secondDistance,
      firstDistance * 2 + secondDistance
    ];
    const notes = Tone.Frequency("C2").harmonize(this.intervals);
    notes.map((note, index) => {
      this.oscs[index].frequency.value = note;
    });

    this.panner.pan.value = mapRange(y, 0, height, -1.0, 1.0);
  }
}
