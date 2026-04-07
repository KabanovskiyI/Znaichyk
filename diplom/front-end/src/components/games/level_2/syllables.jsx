import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../../assets/css/components/games/level_2/syllables.module.css';
import SoundIcon from '../../../utils/SoundIcon';
import { buttonsData } from '../../../utils/buttonsData.js';
// Імпортуємо нові дані складів
import { getRandomSyllables } from '../../../utils/syllablesData.js'; 
import { playSound } from '../../../utils/audioHelper.js';
import ConfettiPopper from '../../ui/ConfettiPopper';

import taskSound from '/assets/games/level_2/syllables/sounds/syllables_start.mp3';
import win from '/assets/sounds/confetti-pop.mp3';

const Syllables = ({ onSuccess }) => {
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
    // 1. Отримуємо 3 рандомні склади
    const randomSyllables = getRandomSyllables(3);
    // 2. Отримуємо 3 рандомні стилі кнопок
    const randomStyles = shuffle(buttonsData).slice(0, 3);

    // 3. З'єднуємо дані складів зі стилями
    const gameItems = randomSyllables.map((sylData, index) => ({
      ...sylData,
      ...randomStyles[index],
      // Важливо: додаємо поле 'letter', щоб не переписувати логіку порівняння в усьому компоненті
      letter: sylData.syllable 
    }));

    return {
      topRow: shuffle(gameItems),
      bottomRow: shuffle(gameItems)
    };
  }, []);

  useEffect(() => {
    const handleVictory = async () => {
      if (matchedLetters.length > 0 && matchedLetters.length === topRow.length) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setShowConfetti(true);
        await playSound(win);
        if (onSuccess) onSuccess(true);
      }
    };
    handleVictory();
  }, [matchedLetters, topRow.length, onSuccess]);

  const handleButtonClick = (item, row) => {
    if (matchedLetters.includes(item.letter)) return;

    if (row === 'bottom') {
      playSound(item.sound);
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
                
                {/* ВИПРАВЛЕНО: Текст відображається ТІЛЬКИ для верхнього ряду */}
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

export default Syllables;