import Tone from "tone";
import mapRange from "../mapRange";

// create modules
const reverb = new Tone.Reverb(2.5);
const osc = new Tone.PulseOscillator(80, 0.2);
const env = new Tone.AmplitudeEnvelope();

// generate impulse response for verb, then connect modules
reverb.generate().then(() => {
  osc.start();
  osc.connect(env);
  env.connect(reverb);
  reverb.toMaster();
});

export function startNote() {
  env.triggerAttack("+0.05", 0.8);
}

export function endNote() {
  env.triggerRelease("+0.05");
}

export function changeParam(x, y, width, height) {
  osc.width.value = mapRange(x, 0, width, 0, 1.0);
  osc.detune.value = mapRange(y, 0, height, 50.0, -50.0);
}
