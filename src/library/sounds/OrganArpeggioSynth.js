import Tone from "tone";
import mapRange from "../mapRange";

export default class OrganArpeggioSynth {
  constructor() {
    this.osc = new Tone.Oscillator("C2", "sine");
    this.osc.partials = [1, 0, 0.2, 0, 0.3, 0, 0.4, 0.3, 0.2, 0.4];
    this.pattern = new Tone.Pattern(
      (time, note) => {
        this.osc.frequency.value = note;
      },
      [
        "C2",
        "Eb2",
        "G2",
        "Bb2",
        "D3",
        "F3",
        "A3",
        "D4",
        "E4",
        "D4",
        "C4",
        "A3",
        "G#3",
        "E3",
        "D3",
        "A2",
        "C3"
      ],
      "up"
    );
    this.env = new Tone.AmplitudeEnvelope();
    this.chorus = new Tone.Chorus(7, 1.8, 0.6);
    this.initialize();
  }

  async initialize() {
    this.osc.start();
    this.osc.connect(this.env);
    this.env.connect(this.chorus);
    this.chorus.toMaster();
    Tone.Transport.bpm.value = 400;
    Tone.Transport.start();
  }

  dispose() {
    this.osc.dispose();
    this.env.dispose();
    this.chorus.dispose();
  }

  startNote() {
    this.pattern.start();
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.pattern.cancel();
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.osc.spread = mapRange(x, 0, width, 0, 20);
    this.osc.detune.value = mapRange(y, 0, height, 50.0, -50.0);
    Tone.Transport.bpm.rampTo(mapRange(x, 0, width, 400, 500), 0.1);
  }
}
