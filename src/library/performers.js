import FreezeFragmentSquareScore from "./scores/FreezeFragmentSquareScore";
import RockScrapeSampler from "./synths/RockScrapeSampler";
import WaterFromWhiteScore from "./scores/WaterFromWhiteScore";
import BubbleVerbSynth from "./synths/BubbleVerbSynth";
import BreathingVideoRevealScore from "./scores/BreathingVideoRevealScore";
import DistortedWaterSampler from "./synths/DistortedWaterSampler";

export const performers = {
  jaleesa: [
    {
      score: FreezeFragmentSquareScore,
      synth: RockScrapeSampler
    }
  ],
  maxx: [
    {
      score: BreathingVideoRevealScore,
      synth: DistortedWaterSampler
    }
  ],
  sarah: [
    {
      score: WaterFromWhiteScore,
      synth: BubbleVerbSynth
    }
  ],
  // TODO: put the main sequence here, so we don't have to split logic and keep track in multiple places
  default: []
};
