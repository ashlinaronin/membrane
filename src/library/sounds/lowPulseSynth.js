import Tone from "tone";
import mapRange from "../mapRange";

// create modules
const reverb = new Tone.Freeverb(0.7, 1500);
const osc = new Tone.PulseOscillator(80, 0.2);
const env = new Tone.AmplitudeEnvelope();

// connect modules
osc.start();
osc.connect(env);
env.connect(reverb);
reverb.toMaster();

export function startNote() {
  env.triggerAttack("+0.05", 0.8);
}

export function endNote() {
  env.triggerRelease("+0.05");
}

export function changeParam(x, y, width, height) {
  osc.phase = mapRange(x, 0, width, 0, 90.0);
  osc.detune.value = mapRange(y, 0, height, -100.0, 100.0);
  osc.width.value = mapRange(y, 0, height, 0, 1.0);
}
