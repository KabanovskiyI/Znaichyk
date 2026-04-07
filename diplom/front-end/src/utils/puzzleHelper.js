const imagePaths = [
  '/assets/games/level_2/puzzle/images/Apple.svg',
  '/assets/games/level_2/puzzle/images/126626630_polz_bma0_230926.svg',
  '/assets/games/level_2/puzzle/images/148750837_9b5205b1-4c33-4abf-bc14-b3733c5df861.svg',
  '/assets/games/level_2/puzzle/images/177782813_c3590cba-75f2-4a56-81ba-87596da2ae8b.svg',
  '/assets/games/level_2/puzzle/images/419117755_6acc94d7-caf5-4bb0-9000-981d37537e91.svg',
];

export const getRandomPuzzleImage = () => {
  if (imagePaths.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

export const getAllPuzzleImages = () => imagePaths;
