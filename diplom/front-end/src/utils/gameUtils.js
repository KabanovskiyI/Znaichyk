export const calculateGlobalLvl = (completedSessions) => {
  const lvl = Math.min(3, Math.floor(completedSessions / 5) + 1);
  console.log("Поточний розрахований рівень гравця:", lvl);
  return lvl;
};

export const getWeightedPool = (availableGames, currentLvl) => {
  const weightedPool = [];
  
  console.log("Вхідні ігри для фільтрації:", availableGames);

  availableGames.forEach((game) => {
    // Більш надійний спосіб дістати цифру рівня з рядка типу "math_lvl_1" або "logic_1"
    const match = game.id.match(/\d+/); 
    const gameLvl = match ? parseInt(match[0], 10) : 1;

    let isAllowed = false;

    if (currentLvl === 1) {
      isAllowed = (gameLvl === 1);
    } else if (currentLvl === 2) {
      isAllowed = (gameLvl === 1 || gameLvl === 2);
    } else if (currentLvl === 3) {
      isAllowed = (gameLvl === 2 || gameLvl === 3);
    }

    if (isAllowed) {
      weightedPool.push(game);
      // Подвійна вага для актуального рівня
      if (gameLvl === currentLvl && currentLvl > 1) {
        weightedPool.push(game);
      }
    }
  });

  if (weightedPool.length === 0 && availableGames.length > 0) {
    console.warn("УВАГА: weightedPool порожній після фільтрації! Перевірте логіку рівнів.");
    // Фолбек: якщо нічого не підійшло, даємо просто доступні ігри, щоб не ламалося
    return availableGames; 
  }

  console.log("Результат зваженого пулу:", weightedPool);
  return weightedPool;
};

export const generateSequence = (weightedPool, count = 5) => {
  if (!weightedPool || weightedPool.length === 0) return [];
  const sequence = [];

  for (let i = 0; i < count; i++) {
    const lastId = sequence[i - 1]?.id;
    const prevLastId = sequence[i - 2]?.id;

    const options = weightedPool.filter(g => g.id !== lastId && g.id !== prevLastId);
    const source = options.length > 0 ? options : weightedPool;
    const pick = source[Math.floor(Math.random() * source.length)];

    sequence.push({ 
      ...pick, 
      instanceId: `${pick.id}-${i}-${Date.now()}-${Math.random()}` 
    });
  }
  return sequence;
};