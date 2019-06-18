import Tone from "tone";
import mapRange from "../mapRange";
import aviemoreStream from "../../assets/aviemore-cut.mp3";

export default class DistortedWaterSampler {
  constructor() {
    this.player = new Tone.Player(aviemoreStream, () => {
      this.initialize();
    });

    this.env = new Tone.AmplitudeEnvelope(0.05, 0.2, 1.0, 0.8);
  }

  async initialize() {
    this.player.loop = true;
    this.player.start();
    this.player.connect(this.env);
    this.env.toMaster();
  }

  dispose() {
    this.player.stop();
    this.player.dispose();
    this.env.dispose();
    this.player = null;
    this.env = null;
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.player.grainSize = mapRange(x, 0, width, 0.001, 0.5);
    this.player.playbackRate = mapRange(y, 0, height, 0.2, 2.0);
    this.player.overlap = mapRange(x, 0, width, 0.001, 8.0);
  }
}
