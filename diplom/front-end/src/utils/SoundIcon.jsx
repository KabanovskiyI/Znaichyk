import { useEffect, useState } from 'react';
import styles from '../../public/assets/css/soundsIcon.module.css';
import gromophone from '../../public/assets/images/sound/gromophone.svg';
import sprite1 from '../../public/assets/images/sound/sprite_1.svg';
import sprite2 from '../../public/assets/images/sound/sprite_2.svg';
import sprite3 from '../../public/assets/images/sound/sprite_3.svg';

const SoundIcon = ({ isClicked, trigger }) => {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isClicked) {
      setIsPlaying(true);
      setFrame(0);
      interval = setInterval(() => {
        setFrame((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            setIsPlaying(false);
            return 3;
          }
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [trigger, isClicked]);

  return (
    <div className={styles.soundIconContainer}>
      <div className={styles.soundFlexRow}>
        <div className={`${styles.soundItem} ${styles.gromophoneBox}`}>
          <img src={gromophone} alt="" className={styles.soundImgFixed} />
        </div>
        <div className={`${styles.soundItem} ${styles.wave_1}`}>
          {(!isPlaying || frame >= 1) && <img src={sprite1} alt="" className="sound-img-fixed" />}
        </div>
        <div className={`${styles.soundItem} ${styles.wave_2}`}>
          {(!isPlaying || frame >= 2) && <img src={sprite2} alt="" className="sound-img-fixed" />}
        </div>
        <div className={`${styles.soundItem} ${styles.wave_3}`}>
          {(!isPlaying || frame >= 3) && <img src={sprite3} alt="" className="sound-img-fixed" />}
        </div>
      </div>
    </div>
  );
};

export default SoundIcon;