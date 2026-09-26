export const WHISPERS_DATA: string[] = [
  "Unclench your jaw.",
  "Drop your shoulders away from your ears.",
  "Whatever happened today can wait.",
  "Let your tongue rest gently behind your upper teeth.",
  "Notice the gentle rise and fall of your breath.",
  "Soft eyes. Release the quiet tension around your temples.",
  "You do not need to produce anything right now.",
  "Feel gravity supporting you. You do not need to hold yourself up.",
  "There is nothing here that needs fixing.",
  "Relax the palms of your hands and uncurl your fingers.",
  "Let go of the next five minutes.",
  "Exhale completely. Let the air leave without rushing.",
  "You have arrived. There is nowhere else you need to be.",
  "Release the tightness in your forehead and eyebrows.",
  "Allow your thoughts to pass like ripples in deep water.",
  "Inhale peace. Exhale urgency.",
  "You are safe in this quiet moment.",
  "Loosen your collarbones. Give your lungs room to expand.",
  "No expectations. No score to beat. No finish line.",
  "Notice the silence between your heartbeats.",
  "Soften your stomach muscles. Let your belly soften outward.",
  "Give yourself permission to do nothing for a little while.",
  "Feel the stillness underneath all the world’s noise.",
  "Unfurrow your brow.",
  "The current carries you effortlessly.",
  "Relax your lower back.",
  "You are more than the things you did or didn't finish today.",
  "Let your neck muscles go slack.",
  "Breathe in through your nose, soft and slow.",
  "Release any urge to hurry. There is no destination.",
  "Allow this descent to wash away the weight of the day.",
  "Sink a little deeper into comfort.",
  "Observe this present moment without judging it.",
  "Your breath is an anchor that is always with you.",
  "Trust the infinite descent."
];

// Helper to get whisper for a given depth interval
export function getWhisperForDepth(intervalIndex: number): string {
  const index = Math.abs(intervalIndex) % WHISPERS_DATA.length;
  return WHISPERS_DATA[index];
}
