import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './simon.module.css';
import { playSound } from '../../../utils/audioHelper.js';
import ConfettiPopper from '../../ui/ConfettiPopper';

import winSound from '/assets/sounds/confetti-pop.mp3';
import startSound from '/assets/games/level_2/simon/sounds/start_sound.mp3';
import beepSound from '/assets/games/level_2/simon/sounds/beep.mp3'; 

const SEQUENCE_LENGTH = Math.floor(Math.random() * 3) + 3; // Випадково від 3 до 5
const COLORS = ['green', 'red', 'yellow', 'blue'];

const SimonMemoryGame = ({ onSuccess }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false); // Чи показуємо ми послідовність зараз
  const [activeColor, setActiveColor] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);

  const initGame = useCallback(() => {
    playSound(startSound);
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, () => 
      Math.floor(Math.random() * 4)
    );
    setSequence(newSequence);
    setUserSequence([]);
    setShowConfetti(false);
    
    // Починаємо показ після невеликої паузи, щоб гравець приготувався
    setTimeout(() => {
      playFullSequence(newSequence);
    }, 1500);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Функція для візуального показу послідовності
  const playFullSequence = async (seq) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600)); // Пауза між спалахами
      setActiveColor(seq[i]);
      playSound(beepSound, true);
      await new Promise(resolve => setTimeout(resolve, 600)); // Тривалість спалаху
      setActiveColor(null);
    }
    setIsPlaying(false);
    setIsGameReady(true);
  };

  const handleColorClick = async (index) => {
    if (isPlaying || showConfetti || !isGameReady) return;

    // Візуальний відгук на клік
    setActiveColor(index);
    playSound(beepSound, true);
    setTimeout(() => setActiveColor(null), 300);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Перевірка на помилку
    if (index !== sequence[userSequence.length]) {
      // Помилка: скидаємо і показуємо знову через секунду
      setIsGameReady(false);
      setUserSequence([]);
      setTimeout(() => playFullSequence(sequence), 1000);
      return;
    }

    // Перевірка на перемогу
    if (newUserSequence.length === sequence.length) {
      setShowConfetti(true);
      await playSound(winSound);
      if (onSuccess) onSuccess(true);
    }
  };

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.simonCircle}>
        {COLORS.map((color, index) => (
          <motion.div
            key={color}
            className={`${styles.segment} ${styles[color]} ${activeColor === index ? styles.active : ''}`}
            whileTap={!isPlaying ? { scale: 0.95 } : {}}
            onClick={() => handleColorClick(index)}
          />
        ))}
        <div className={styles.centerCircle}>
            <span className={styles.statusText}>
                {isPlaying ? 'Дивись...' : 'Повторюй!'}
            </span>
        </div>
      </div>
      
      <ConfettiPopper isTriggered={showConfetti} />
    </div>
  );
};

export default SimonMemoryGame;