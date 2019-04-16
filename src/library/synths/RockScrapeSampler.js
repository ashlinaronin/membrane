import Tone from "tone";
import mapRange from "../mapRange";
import rockScrape from "../../assets/rock-scrape-cut.mp3";

export default class RockScrapeSampler {
  constructor() {
    this.grainPlayer = new Tone.GrainPlayer(rockScrape, () => {
      this.initialize();
    });
    this.env = new Tone.AmplitudeEnvelope(0.05, 0.2, 1.0, 0.1);
  }

  async initialize() {
    this.grainPlayer.loop = true;
    this.grainPlayer.start();
    this.grainPlayer.connect(this.env);
    this.env.toMaster();
  }

  dispose() {
    this.grainPlayer.stop();
    this.grainPlayer.dispose();
    this.env.dispose();
    this.grainPlayer = null;
    this.env = null;
  }

  startNote() {
    this.env.triggerAttack("+0.05", 0.8);
  }

  endNote() {
    this.env.triggerRelease("+0.05");
  }

  changeParam(x, y, width, height) {
    this.grainPlayer.grainSize = mapRange(x, 0, width, 0.001, 0.5);
    this.grainPlayer.playbackRate = mapRange(y, 0, height, 0.2, 2.0);
    this.grainPlayer.overlap = mapRange(x, 0, width, 0.001, 8.0);
  }
}
