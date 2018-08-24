import Tone from "tone";
import mapRange from "../mapRange";

export default class OrganArpeggioSynth {
  constructor() {
    this.osc = new Tone.Oscillator("C2", "sine");
    this.osc.partials = [1, 0, 0.2, 0, 0.3, 0, 0.4, 0.3, 0.2, 0.4];

    this.intervalChain = new Tone.CtrlMarkov({
      4: [5, 7],
      5: [3, 7],
      7: [3, 5],
      3: 4
    });
    this.intervalChain.value = 3;

    this.directionChain = new Tone.CtrlMarkov({
      up: [
        {
          value: "down",
          probability: 0.2
        },
        {
          value: "up",
          probability: 0.8
        }
      ],
      down: [
        {
          value: "up",
          probability: 0.2
        },
        {
          value: "down",
          probability: 0.8
        }
      ]
    });
    this.directionChain.value = "up";

    this.loop = new Tone.Loop(() => {
      const interval = this.intervalChain.next();
      const directionMultiplier =
        this.directionChain.next() === "up" ? 10 : -10;

      this.osc.frequency.value += directionMultiplier * interval;
    }, "8n");

    this.loop.humanize = true;
    this.env = new Tone.AmplitudeEnvelope();
    this.chorus = new Tone.Chorus(7, 1.8, 0.6);
    this.initialize();
  }

  async initialize() {
    this.osc.start();
    this.osc.connect(this.env);
    this.env.connect(this.chorus);
    this.chorus.toMaster();
    Tone.Transport.bpm.value = 170;
    Tone.Transport.start();
  }

  dispose() {
    this.osc.dispose();
    this.env.dispose();
    this.chorus.dispose();
    this.loop.dispose();
    this.intervalChain.dispose();
    this.directionChain.dispose();
    this.osc = null;
    this.env = null;
    this.chorus = null;
    this.loop = null;
    this.intervalChain = null;
    this.directionChain = null;
  }

  startNote() {
    this.loop.start();
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.loop.cancel();
    this.loop.stop();
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.osc.spread = mapRange(x, 0, width, 0, 20);
    this.osc.detune.value = mapRange(y, 0, height, 50.0, -50.0);
    Tone.Transport.bpm.rampTo(mapRange(x, 0, width, 400, 500), 0.1);
  }
}
