export const speak = (message: string, enabled: boolean, volume = 1) => {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.volume = volume;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
};