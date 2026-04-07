import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../../assets/css/components/games/level_1/abc.module.css';
import SoundIcon from '../../../utils/SoundIcon';
import { buttonsData } from '../../../utils/buttonsData.js';
import { alphabetData } from '../../../utils/abcSoundsData.js';
import { playSound } from '../../../utils/audioHelper.js'; // Імпорт вашої утиліти
import ConfettiPopper from '../../ui/ConfettiPopper';

import taskSound from '/assets/games/level_1/abc/sounds/ABC_task_1.mp3';
import win from '/assets/sounds/confetti-pop.mp3';

const ABC = ({ onSuccess }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchedLetters, setMatchedLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  
  const [lastClickedLetter, setLastClickedLetter] = useState(null);
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [clickTrigger, setClickTrigger] = useState(0);

  const shuffle = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const { topRow, bottomRow } = useMemo(() => {
    const randomLetters = shuffle(alphabetData).slice(0, 3);
    const randomStyles = shuffle(buttonsData).slice(0, 3);

    const gameItems = randomLetters.map((letterData, index) => ({
      ...letterData,
      ...randomStyles[index]
    }));

    return {
      topRow: shuffle(gameItems),
      bottomRow: shuffle(gameItems)
    };
  }, []);

  // --- ВІДСЛІДКОВУВАННЯ ПЕРЕМОГИ (Асинхронне) ---
  useEffect(() => {
    const handleVictory = async () => {
      if (matchedLetters.length > 0 && matchedLetters.length === topRow.length) {
        // Невелика пауза перед звуком, щоб гравець побачив останній "метч"
        await new Promise(resolve => setTimeout(resolve, 600));
        setShowConfetti(true);
        
        // Чекаємо, поки звук перемоги закінчиться повністю
        await playSound(win);
        
        if (onSuccess) {
          onSuccess(true);
        }
      }
    };

    handleVictory();
  }, [matchedLetters, topRow.length, onSuccess]);

  const handleButtonClick = (item, row) => {
    if (matchedLetters.includes(item.letter)) return;

    if (row === 'bottom') {
      playSound(item.sound); // Використовуємо глобальну утиліту
    }

    setLastClickedLetter(item.letter);
    setLastClickedRow(row);
    setClickTrigger(prev => prev + 1);

    if (selectedLetter === item.letter && selectedRow !== row) {
      setMatchedLetters((prev) => [...prev, item.letter]);
      setSelectedLetter(null);
      setSelectedRow(null);
    } else {
      setSelectedLetter(item.letter);
      setSelectedRow(row);
    }
  };

  // Стартове завдання
  useEffect(() => {
    playSound(taskSound);
  }, []);

  const renderButton = (item, row) => {
    if (!item) return null;

    const isMatched = matchedLetters.includes(item.letter);
    const isCurrentSelection = selectedLetter === item.letter && selectedRow === row;
    const isActive = isMatched || isCurrentSelection;
    const isThisButtonLastClicked = lastClickedLetter === item.letter && lastClickedRow === row;

    return (
      <button
        key={`${row}-${item.letter}`}
        className={`${styles.gridBtn} ${isActive ? styles.active : ''} ${isMatched ? styles.matched : ''}`}
        onClick={() => handleButtonClick(item, row)}
        disabled={isMatched}
      >
        <div className={styles.btnContentWrapper}>
          <img 
            src={isActive ? item.activeSrc : item.defaultSrc} 
            alt={item.alt}
            className={styles.btnImage} 
          />
          {row === 'top' && (
            <span className={styles.btnLetterOverlay}>{item.letter}</span>
          )}
          {row === 'bottom' && (
            <SoundIcon 
              isClicked={isThisButtonLastClicked} 
              trigger={clickTrigger} 
            />
          )}
        </div>
      </button>
    );
  };
  
  return (
    <div className={styles.gridWrapper}>
      <div className={styles.gridContainer}>
        <div className={styles.row}>
          {topRow.map((item) => renderButton(item, 'top'))}
        </div>
        <div className={styles.row}>
          {bottomRow.map((item) => renderButton(item, 'bottom'))}
        </div>
      </div>
      <ConfettiPopper isTriggered={showConfetti} />
    </div>
  );
};

export default ABC;