import Tone from "tone";
import mapRange from "../mapRange";

export default class DetunedChordSynth {
  constructor() {
    this.intervals = [0, 4, 5, 9];
    const notes = Tone.Frequency("C2").harmonize(this.intervals);
    this.oscs = notes.map(note => {
      return new Tone.Oscillator(note, "sawtooth6");
    });

    this.env = new Tone.AmplitudeEnvelope(0.4, 0.2, 0.9, 1.2);
    this.delay = new Tone.FeedbackDelay("8n", 0.35);
    this.initialize();
  }

  async initialize() {
    this.oscs.forEach(osc => {
      osc.connect(this.env);
      osc.start();
    });
    this.env.connect(this.delay);
    this.delay.toMaster();
  }

  dispose() {
    this.oscs.forEach(osc => osc.dispose());
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
  }
}
