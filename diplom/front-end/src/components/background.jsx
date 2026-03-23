import React, { useState, useEffect } from 'react';
import styles from '../../public/assets/css/background.module.css';

import skySrc from '../../public/assets/images/Background/Sky.svg';
import lgSrc from '../../public/assets/images/Background/Lg1.svg';
import hgSrc from '../../public/assets/images/Background/Hg1.svg';
import cloud1 from '../../public/assets/images/Background/CloudFrontLayer1.svg';
import cloud2 from '../../public/assets/images/Background/CloudFrontLayer2.svg';
import cloud3 from '../../public/assets/images/Background/CloudFrontLayer3.svg';
import cloudD1 from '../../public/assets/images/Background/CloudBackLayer1.svg';
import cloudD2 from '../../public/assets/images/Background/CloudBackLayer2.svg';
import cloudD3 from '../../public/assets/images/Background/CloudBackLayer3.svg';

const GameBackground = ({ step }) => {
  const [animState, setAnimState] = useState('idle');

  const currentRotation = step * 360;

  useEffect(() => {
    if (step === 0) return;

    setAnimState('exiting');

    const timer = setTimeout(() => {
      setAnimState('entering');
      
      const timer2 = setTimeout(() => {
        setAnimState('idle');
      }, 50);
      
      return () => clearTimeout(timer2);
    }, 1200);

    return () => clearTimeout(timer);
  }, [step]);

  const renderClouds = (layerClass, images) => (
    <div className={`${styles.cloudsContainer} ${layerClass} ${styles[animState]}`}>
      <div className={styles.cloudsLeftGroup}>
         <img src={images[0]} className={`${styles.cloud} ${styles.posLeft}`} alt="" />
      </div>
      <div className={styles.cloudsRightGroup}>
         <img src={images[1]} className={`${styles.cloud} ${styles.posCenter}`} alt="" />
         <img src={images[2]} className={`${styles.cloud} ${styles.posRight}`} alt="" />
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <img src={skySrc} className={styles.skyLayer} alt="sky" />

      {renderClouds(styles.cloudsDistant, [cloudD1, cloudD2, cloudD3])}
      {renderClouds(styles.cloudsFar, [cloud1, cloud2, cloud3])}

      <img 
        src={lgSrc} 
        className={`${styles.groundBase} ${styles.groundLgLeft}`} 
        style={{ '--rot': `${currentRotation}deg` }}
        alt="" 
      />
      <img 
        src={lgSrc} 
        className={`${styles.groundBase} ${styles.groundLgRight}`} 
        style={{ '--rot': `${currentRotation}deg` }}
        alt="" 
      />

      {renderClouds(styles.cloudsNear, [cloud2, cloud1, cloud3])}

      <img 
        src={hgSrc} 
        className={`${styles.groundBase} ${styles.groundHgLeft}`} 
        style={{ '--rot': `${currentRotation}deg` }}
        alt="" 
      />
      <img 
        src={hgSrc} 
        className={`${styles.groundBase} ${styles.groundHgRight}`} 
        style={{ '--rot': `${currentRotation}deg` }}
        alt="" 
      />
    </div>
  );
};

export default GameBackground;