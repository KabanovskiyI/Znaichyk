const imageModules = import.meta.glob('../../public/assets/games/level_2/puzzle/images/*.{png,jpg,jpeg,svg,webp}', { eager: true });

const imagePaths = Object.values(imageModules).map((mod) => mod.default || mod);

export const getRandomPuzzleImage = () => {
  if (imagePaths.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

export const getAllPuzzleImages = () => imagePaths;