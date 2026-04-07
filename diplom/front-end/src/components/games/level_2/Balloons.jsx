import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiPopper from '../../ui/ConfettiPopper';
import { playSound } from '../../../utils/audioHelper.js'; 
import styles from '../../../assets/css/components/games/level_2/balloons.module.css';

const BALLOON_ASSETS = [
  '/assets/games/level_2/balloons/images/lime.svg',
  '/assets/games/level_2/balloons/images/purple.svg',
  '/assets/games/level_2/balloons/images/turquoise.svg',
  '/assets/games/level_2/balloons/images/yellow.svg',
];

const START_SOUND = '/assets/games/level_2/balloons/sounds/start.mp3';
const WIN_SOUND = '/assets/sounds/confetti-pop.mp3';

const BalloonsGame = ({ onSuccess }) => {
  const [isWon, setIsWon] = useState(false);
  const [poppedId, setPoppedId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const hasStartedAudio = useRef(false);

  const gameData = useMemo(() => {
    const count = Math.floor(Math.random() * 3) + 4; 
    const balloons = [];
    const usedPositions = [];

    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * 10);
      const assetIndex = Math.floor(Math.random() * BALLOON_ASSETS.length);
      
      let x, y, isTooClose;
      let attempts = 0;
      do {
        x = Math.random() * 74 + 8; 
        y = Math.random() * 45 + 10; 
        isTooClose = usedPositions.some(pos => 
          Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < 16
        );
        attempts++;
      } while (isTooClose && attempts < 100);

      usedPositions.push({ x, y });
      balloons.push({ 
        id: i, 
        value, 
        asset: BALLOON_ASSETS[assetIndex], 
        left: `${x}%`, 
        top: `${y}%`,
        floatDuration: 2.5 + Math.random() * 1.5,
        floatOffset: 12 + Math.random() * 8,
        delay: i * 0.15 // Невеликий каскадний виліт
      });
    }

    const target = balloons[Math.floor(Math.random() * balloons.length)];
    return { balloons, target };
  }, []);

  useEffect(() => {
    if (hasStartedAudio.current) return;
    const playTask = async () => {
      hasStartedAudio.current = true;
      await playSound(START_SOUND);
      await playSound(`/assets/games/level_2/balloons/sounds/${gameData.target.value}.mp3`);
    };
    playTask();
  }, [gameData.target.value]);

  const handleBalloonClick = (balloon) => {
    if (isWon || poppedId !== null) return;

    if (balloon.value === gameData.target.value) {
      setPoppedId(balloon.id); 
      playSound(WIN_SOUND);
      setIsWon(true);
      if (onSuccess) setTimeout(() => onSuccess(true), 2500);
    } else {
      setWrongId(balloon.id);
      playSound(`/assets/games/level_2/balloons/sounds/${balloon.value}.mp3`);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className={styles.gameContainer}>
      <AnimatePresence>
        {gameData.balloons.map((balloon) => {
          const isPopped = poppedId === balloon.id;
          const isWrong = wrongId === balloon.id;

          return (
            <motion.div
              key={balloon.id}
              className={styles.balloonWrapper}
              style={{
                position: 'absolute',
                left: balloon.left,
                top: balloon.top,
                zIndex: isPopped ? 100 : 10
              }}
              // 1. ЗОВНІШНІЙ ШАР: Виліт знизу (один раз) + Вихід (лопання)
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                y: { type: 'spring', damping: 20, stiffness: 40, delay: balloon.delay },
                opacity: { duration: 0.5, delay: balloon.delay }
              }}
              exit={{
                scale: [1, 1.8, 0],
                opacity: [1, 1, 0],
                transition: { duration: 0.25, ease: "easeOut" }
              }}
              onClick={() => handleBalloonClick(balloon)}
            >
              {/* 2. СЕРЕДНІЙ ШАР: Безкінечне плавання */}
              <motion.div
                animate={{ y: [0, -balloon.floatOffset, 0] }}
                transition={{
                  duration: balloon.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* 3. ВНУТРІШНІЙ ШАР: Трясіння при помилці */}
                <motion.div
                  className={styles.relativeContainer}
                  animate={isWrong ? {
                    x: [-8, 8, -8, 8, 0],
                    rotate: [-3, 3, -3, 3, 0]
                  } : {}}
                  transition={{ duration: 0.4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {!isPopped && (
                    <>
                      <img 
                        src={balloon.asset} 
                        alt="balloon" 
                        className={styles.balloonImg}
                        draggable={false}
                      />
                      <span className={styles.balloonNumber}>
                        {balloon.value}
                      </span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <ConfettiPopper isTriggered={isWon} />
    </div>
  );
};

export default BalloonsGame;