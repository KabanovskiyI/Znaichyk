import React, { useState, useEffect } from 'react';
import { gameSets, cardBackgrounds } from '../../../utils/OddOneOutData.js';
import ConfettiPopper from '../../ConfettiPopper';
import styles from '../../../../public/assets/css/OddOneOut.module.css';
import win from '../../../../public/assets/sounds/confetti-pop.mp3';
import start from '../../../../public/assets/games/level_1/oddoneout/sounds/task_1_logics.mp3';
import { playSound } from '../../../utils/audioHelper.js';

const OddOneOut = ({ onSuccess }) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [currentItems, setCurrentItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // Хранит уникальный ключ выбранной карточки

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const initGame = () => {
        // Проигрываем стартовый звук задания
        playSound(start);
        setSelectedId(null);

        const randomSetIndex = Math.floor(Math.random() * gameSets.length);
        const selectedSet = gameSets[randomSetIndex];

        // Формируем массив объектов
        const gameObjects = [
            { id: 'enemy', src: selectedSet.enemy, isEnemy: true },
            { id: 'ally_1', src: selectedSet.allies[0], isEnemy: false },
            { id: 'ally_2', src: selectedSet.allies[1], isEnemy: false },
            { id: 'ally_3', src: selectedSet.allies[2], isEnemy: false },
        ];

        const shuffledObjects = shuffleArray(gameObjects);
        const shuffledBackgrounds = shuffleArray(cardBackgrounds);

        // Добавляем фоны и создаем уникальный ключ для каждой карточки
        const finalItems = shuffledObjects.map((item, index) => ({
            ...item,
            uniqueKey: `${item.id}-${index}`, // Нужно для точного определения, на какую кнопку нажали
            background: shuffledBackgrounds[index]
        }));

        setCurrentItems(finalItems);
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleCardClick = async (item) => { 
        // Если уже был сделан правильный выбор — блокируем повторные нажатия
        if (selectedId) return;

        if (item.isEnemy) {
            setSelectedId(item.uniqueKey);
            setShowConfetti(true);

            await playSound(win); 

            await new Promise(resolve => setTimeout(resolve, 500));

            if (onSuccess) {
                onSuccess(true);
            }
        } else {
            // Логика для неправильного выбора (опционально)
            console.log("Неправильно, попробуй еще раз!");
        }
    };

    return (
        <div className={styles.gameContainer}>
            <div className={styles.gridContainerOdd}>
                {currentItems.map((item) => (
                    <button
                        key={item.uniqueKey}
                        // Если этот item — выбранный правильный, добавляем класс correctCard
                        className={`${styles.gameCard} ${
                            selectedId === item.uniqueKey ? styles.correctCard : ''
                        }`}
                        onClick={() => handleCardClick(item)}
                    >
                        <img 
                            src={item.background} 
                            alt="card background" 
                            className={styles.cardBg} 
                        />
                        <img 
                            src={item.src} 
                            alt="game item" 
                            className={styles.cardItem} 
                        />
                    </button>
                ))}
            </div>
            <ConfettiPopper isTriggered={showConfetti} />
        </div>
    );
};

export default OddOneOut;