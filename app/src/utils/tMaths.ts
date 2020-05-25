export default class TMath {
  public static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180.0;
  }

  public static radToDeg(degrees: number): number {
    return (degrees * 180.0) / Math.PI;
  }

  public static clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}
