let context: AudioContext | undefined;
let enabled = true;
export function setSound(value: boolean) {
  enabled = value;
}
export function sound(kind: "click" | "no" | "yes" | "step" | "end" = "click") {
  if (!enabled) return;
  try {
    context ||= new AudioContext();
    if (context.state === "suspended") void context.resume();
    const tones =
      kind === "yes"
        ? [440, 554, 659]
        : kind === "end"
          ? [330, 440, 554, 659, 880]
          : kind === "no"
            ? [180, 120]
            : kind === "step"
              ? [95]
              : [520];
    tones.forEach((frequency, i) => {
      const osc = context!.createOscillator(),
        gain = context!.createGain();
      const at = context!.currentTime + i * 0.075;
      osc.type = kind === "step" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(frequency, at);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, at + 0.09);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.055, at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.14);
      osc.connect(gain);
      gain.connect(context!.destination);
      osc.start(at);
      osc.stop(at + 0.15);
    });
  } catch {
    /* Audio is optional in browsers without Web Audio. */
  }
}
