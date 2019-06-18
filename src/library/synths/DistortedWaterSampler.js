import Tone from "tone";
import mapRange from "../mapRange";
import aviemoreStream from "../../assets/aviemore-cut.mp3";

export default class DistortedWaterSampler {
  constructor() {
    this.player = new Tone.Player(aviemoreStream, () => {
      this.initialize();
    });

    this.env = new Tone.AmplitudeEnvelope(0.05, 0.8, 1.0, 0.8);
    this.delay = new Tone.FeedbackDelay();
  }

  async initialize() {
    this.player.loop = true;
    this.player.start();
    this.player.chain(this.env, this.delay, Tone.Master);
  }

  dispose() {
    this.player.stop();
    this.player.dispose();
    this.env.dispose();
    this.delay.dispose();
    this.player = null;
    this.env = null;
    this.delay = null;
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  // eslint-disable-next-line no-unused-vars
  changeParam(x, y, width, height) {
    this.player.playbackRate = mapRange(y, 0, height, 0.2, 2.0);
  }
}
