import soundA from '../../public/assets/sounds/abc/A.mp3';
import soundB from '../../public/assets/sounds/abc/Be.mp3';
import soundV from '../../public/assets/sounds/abc/Ve.mp3';
import soundG from '../../public/assets/sounds/abc/Ge.mp3';
import soundGG from '../../public/assets/sounds/abc/GGe.mp3';
import soundD from '../../public/assets/sounds/abc/De.mp3';
import soundE from '../../public/assets/sounds/abc/E.mp3';
import soundYe from '../../public/assets/sounds/abc/Ee.mp3';
import soundZh from '../../public/assets/sounds/abc/Je.mp3';
import soundZ from '../../public/assets/sounds/abc/Ze.mp3';
import soundY from '../../public/assets/sounds/abc/Uu.mp3'; // И
import soundYi from '../../public/assets/sounds/abc/I.mp3'; // І
import soundYii from '../../public/assets/sounds/abc/II.mp3'; // Ї
import soundYot from '../../public/assets/sounds/abc/JII.mp3'; // Й
import soundK from '../../public/assets/sounds/abc/K.mp3';
import soundL from '../../public/assets/sounds/abc/L.mp3';
import soundM from '../../public/assets/sounds/abc/M.mp3';
import soundN from '../../public/assets/sounds/abc/N.mp3';
import soundO from '../../public/assets/sounds/abc/O.mp3';
import soundP from '../../public/assets/sounds/abc/Pe.mp3';
import soundR from '../../public/assets/sounds/abc/Er.mp3';
import soundS from '../../public/assets/sounds/abc/Es.mp3';
import soundT from '../../public/assets/sounds/abc/Te.mp3';
import soundU from '../../public/assets/sounds/abc/Y.mp3';
import soundF from '../../public/assets/sounds/abc/Ef.mp3';
import soundKh from '../../public/assets/sounds/abc/Ha.mp3';
import soundTs from '../../public/assets/sounds/abc/Ce.mp3';
import soundCh from '../../public/assets/sounds/abc/Che.mp3';
import soundSh from '../../public/assets/sounds/abc/Sha.mp3';
import soundShch from '../../public/assets/sounds/abc/Shcha.mp3';
import soundSoft from '../../public/assets/sounds/abc/ss.mp3'; // Ь
import soundYu from '../../public/assets/sounds/abc/You.mp3';
import soundYa from '../../public/assets/sounds/abc/Ya.mp3';

export const alphabetData = [
  { letter: 'А', sound: soundA },
  { letter: 'Б', sound: soundB },
  { letter: 'В', sound: soundV },
  { letter: 'Г', sound: soundG },
  { letter: 'Ґ', sound: soundGG },
  { letter: 'Д', sound: soundD },
  { letter: 'Е', sound: soundE },
  { letter: 'Є', sound: soundYe },
  { letter: 'Ж', sound: soundZh },
  { letter: 'З', sound: soundZ },
  { letter: 'И', sound: soundY },
  { letter: 'І', sound: soundYi },
  { letter: 'Ї', sound: soundYii },
  { letter: 'Й', sound: soundYot },
  { letter: 'К', sound: soundK },
  { letter: 'Л', sound: soundL },
  { letter: 'М', sound: soundM },
  { letter: 'Н', sound: soundN },
  { letter: 'О', sound: soundO },
  { letter: 'П', sound: soundP },
  { letter: 'Р', sound: soundR },
  { letter: 'С', sound: soundS },
  { letter: 'Т', sound: soundT },
  { letter: 'У', sound: soundU },
  { letter: 'Ф', sound: soundF },
  { letter: 'Х', sound: soundKh },
  { letter: 'Ц', sound: soundTs },
  { letter: 'Ч', sound: soundCh },
  { letter: 'Ш', sound: soundSh },
  { letter: 'Щ', sound: soundShch },
  { letter: 'Ь', sound: soundSoft },
  { letter: 'Ю', sound: soundYu },
  { letter: 'Я', sound: soundYa },
];

export const getRandomLetters = (count = 3) => {
  return [...alphabetData]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};