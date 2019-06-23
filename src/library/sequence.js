import FreezeFragmentSquareScore from "./scores/FreezeFragmentSquareScore";
import RockScrapeSampler from "./synths/RockScrapeSampler";
import WaterFromWhiteScore from "./scores/WaterFromWhiteScore";
import BubbleVerbSynth from "./synths/BubbleVerbSynth";
import BreathingVideoRevealScore from "./scores/BreathingVideoRevealScore";
import DistortedWaterSampler from "./synths/DistortedWaterSampler";
import ChemtrailsVideoScore from "./scores/ChemtrailsVideoScore";
import LowPulseSynth from "./synths/LowPulseSynth";
import VideoPixelGridScore from "./scores/VideoPixelGridScore";
import MetallicSynth from "./synths/MetallicSynth";
import BreathingPixelGridScore from "./scores/BreathingPixelGridScore";
import GrassPixelGridScore from "./scores/GrassPixelGridScore";
import SneezeSampler from "./synths/SneezeSampler";
import WaterPixelGridScore from "./scores/WaterPixelGridScore";
import SineTremoloSynth from "./synths/SineTremoloSynth";

export default {
  jaleesa: [
    {
      score: FreezeFragmentSquareScore,
      synth: RockScrapeSampler
    }
  ],
  maximiliano: [
    {
      score: BreathingVideoRevealScore,
      synth: DistortedWaterSampler
    }
  ],
  sarah: [
    {
      score: WaterFromWhiteScore,
      synth: BubbleVerbSynth
    },
    {
      score: ChemtrailsVideoScore,
      synth: LowPulseSynth
    }
  ],
  default: [
    {
      score: VideoPixelGridScore,
      synth: MetallicSynth
    },
    {
      score: BreathingPixelGridScore,
      synth: LowPulseSynth
    },
    {
      score: GrassPixelGridScore,
      synth: SneezeSampler
    },
    {
      score: WaterPixelGridScore,
      synth: SineTremoloSynth
    }
  ]
};
