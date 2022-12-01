export function RandomInt(max: number, min = 0) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}
