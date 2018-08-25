let val;

export default function mapRange(num, in_min, in_max, out_min, out_max) {
  val = ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

  if (val < out_min) {
    val = out_min;
  }

  if (val > out_max) {
    val = out_max;
  }

  return val;
}
