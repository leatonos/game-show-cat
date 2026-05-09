const SOUND_MAP: Record<string, string> = {
  '1': 'success_01.mp3',
  '2': 'error.mp3',
  '3': 'bell.mp3',
  '4': 'fail.mp3',
  '*': 'beep.mp3',
};

// Cache audio instances so play and stop share the same object
const audioCache: Record<string, HTMLAudioElement> = {};

const getAudio = (key: string): HTMLAudioElement | null => {
  const soundFileName = SOUND_MAP[key];
  if (!soundFileName) return null;

  if (!audioCache[key]) {
    audioCache[key] = new Audio(`/soundfx/${soundFileName}`);
  }
  return audioCache[key];
};

export const soundCheck = (key: string): boolean => {
  if (SOUND_MAP[key]) return true;
  console.log(`No sound for ${key}`);
  return false;
};

export const playKeySound = (key: string) => {
  const audio = getAudio(key);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(err => console.error("Audio play failed:", err));
  }
};

export const stopSound = (key: string) => {
  const audio = getAudio(key);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};