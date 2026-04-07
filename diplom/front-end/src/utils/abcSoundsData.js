const ABC_SOUNDS_BASE_PATH = '/assets/games/level_1/abc/sounds';

export const alphabetData = [
  { letter: 'А', sound: `${ABC_SOUNDS_BASE_PATH}/A.mp3` },
  { letter: 'Б', sound: `${ABC_SOUNDS_BASE_PATH}/Be.mp3` },
  { letter: 'В', sound: `${ABC_SOUNDS_BASE_PATH}/Ve.mp3` },
  { letter: 'Г', sound: `${ABC_SOUNDS_BASE_PATH}/Ge.mp3` },
  { letter: 'Ґ', sound: `${ABC_SOUNDS_BASE_PATH}/GGe.mp3` },
  { letter: 'Д', sound: `${ABC_SOUNDS_BASE_PATH}/De.mp3` },
  { letter: 'Е', sound: `${ABC_SOUNDS_BASE_PATH}/E.mp3` },
  { letter: 'Є', sound: `${ABC_SOUNDS_BASE_PATH}/Ee.mp3` },
  { letter: 'Ж', sound: `${ABC_SOUNDS_BASE_PATH}/Je.mp3` },
  { letter: 'З', sound: `${ABC_SOUNDS_BASE_PATH}/Ze.mp3` },
  { letter: 'И', sound: `${ABC_SOUNDS_BASE_PATH}/Uu.mp3` },
  { letter: 'І', sound: `${ABC_SOUNDS_BASE_PATH}/I.mp3` },
  { letter: 'Ї', sound: `${ABC_SOUNDS_BASE_PATH}/II.mp3` },
  { letter: 'Й', sound: `${ABC_SOUNDS_BASE_PATH}/JII.mp3` },
  { letter: 'К', sound: `${ABC_SOUNDS_BASE_PATH}/K.mp3` },
  { letter: 'Л', sound: `${ABC_SOUNDS_BASE_PATH}/L.mp3` },
  { letter: 'М', sound: `${ABC_SOUNDS_BASE_PATH}/M.mp3` },
  { letter: 'Н', sound: `${ABC_SOUNDS_BASE_PATH}/N.mp3` },
  { letter: 'О', sound: `${ABC_SOUNDS_BASE_PATH}/O.mp3` },
  { letter: 'П', sound: `${ABC_SOUNDS_BASE_PATH}/Pe.mp3` },
  { letter: 'Р', sound: `${ABC_SOUNDS_BASE_PATH}/Er.mp3` },
  { letter: 'С', sound: `${ABC_SOUNDS_BASE_PATH}/Es.mp3` },
  { letter: 'Т', sound: `${ABC_SOUNDS_BASE_PATH}/Te.mp3` },
  { letter: 'У', sound: `${ABC_SOUNDS_BASE_PATH}/Y.mp3` },
  { letter: 'Ф', sound: `${ABC_SOUNDS_BASE_PATH}/Ef.mp3` },
  { letter: 'Х', sound: `${ABC_SOUNDS_BASE_PATH}/Ha.mp3` },
  { letter: 'Ц', sound: `${ABC_SOUNDS_BASE_PATH}/Ce.mp3` },
  { letter: 'Ч', sound: `${ABC_SOUNDS_BASE_PATH}/Che.mp3` },
  { letter: 'Ш', sound: `${ABC_SOUNDS_BASE_PATH}/Sha.mp3` },
  { letter: 'Щ', sound: `${ABC_SOUNDS_BASE_PATH}/Shcha.mp3` },
  { letter: 'Ь', sound: `${ABC_SOUNDS_BASE_PATH}/ss.mp3` },
  { letter: 'Ю', sound: `${ABC_SOUNDS_BASE_PATH}/You.mp3` },
  { letter: 'Я', sound: `${ABC_SOUNDS_BASE_PATH}/Ya.mp3` },
];

export const getRandomLetters = (count = 3) => {
  return [...alphabetData]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};
