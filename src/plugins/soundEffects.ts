// 1. Every Key Sound
const SOUND_MAP: Record<string, string> = {
  '1':'success_01.mp3',
  '2': 'error.mp3',
  '3': 'bell.mp3',
};

export const soundCheck = (key:string)=>{
    const soundFileName = SOUND_MAP[key];
    if(soundFileName){
        return true
    }else{
        console.log(`No sound for ${key}`)
        return false
    }
}

// 2. If key has a sound play it
export const playKeySound = (key: string) => {
  
    const soundFileName = SOUND_MAP[key];
  
  if (soundFileName) {
   const audio = new Audio(`/soundfx/${soundFileName}`);
    audio.currentTime = 0; // Reset to start if already playing
    audio.play().catch(err => console.error("Audio play failed:", err));
  }
};