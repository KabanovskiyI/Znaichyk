const activeSounds = new Map();

/**
 * Програє звук.
 * @param {string} soundSource - шлях до файлу.
 * @param {boolean} force - якщо true, зупинить такий самий звук, що вже грає, і запустить заново.
 */
export const playSound = (soundSource, force = false) => {
  return new Promise((resolve) => {
    if (!soundSource) return resolve();

    // Якщо звук вже грає
    if (activeSounds.has(soundSource)) {
      if (force) {
        // Примусово зупиняємо старий перед запуском нового
        stopSound(soundSource);
      } else {
        // Інакше просто ігноруємо (стара поведінка)
        return resolve();
      }
    }

    const audio = new Audio(soundSource);
    
    // Зберігаємо об'єкт аудіо та resolve, щоб мати змогу завершити проміс зовні
    activeSounds.set(soundSource, { audio, resolve });

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
      console.warn("Playback blocked by browser:", e);
      cleanup();
    });
  });
};

/**
 * Зупиняє конкретний звук за його джерелом.
 */
export const stopSound = (soundSource) => {
  const active = activeSounds.get(soundSource);
  if (active) {
    active.audio.pause();
    active.audio.currentTime = 0;
    active.resolve(); // Завершуємо проміс
    activeSounds.delete(soundSource);
  }
};

/**
 * Зупиняє всі звуки, що зараз відтворюються.
 * Корисно при переході між іграми або виході в меню.
 */
export const stopAllSounds = () => {
  activeSounds.forEach((value, key) => {
    stopSound(key);
  });
};