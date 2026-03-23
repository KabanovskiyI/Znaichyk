const activeSounds = new Map();

export const playSound = (soundSource) => {
  return new Promise((resolve) => {
    if (!soundSource) {
      return resolve();
    }

    // Якщо цей звук вже грає — ігноруємо новий запит
    if (activeSounds.has(soundSource)) {
      return resolve(); 
    }

    const audio = new Audio(soundSource);
    
    // Реєструємо звук як активний
    activeSounds.set(soundSource, audio);

    const cleanup = () => {
      activeSounds.delete(soundSource);
      resolve();
    };

    audio.onended = cleanup;
    
    audio.onerror = (e) => {
      console.warn("Audio file error or not found:", soundSource);
      cleanup();
    };

    audio.play().catch((e) => {
      // Часто виникає, якщо користувач ще не взаємодіяв зі сторінкою
      console.warn("Playback blocked by browser:", e);
      cleanup();
    });
  });
};