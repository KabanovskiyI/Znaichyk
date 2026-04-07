import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from '../../../../public/assets/css/match.module.css';
import { playSound } from '../../../utils/audioHelper.js';
import ConfettiPopper from '../../ConfettiPopper';

// Звуки
import winSound from '../../../../public/assets/sounds/confetti-pop.mp3';
import startSound from '../../../../public/assets/games/level_3/match/sounds/start_match.mp3';
import flipSound from '../../../../public/assets/games/level_3/match/sounds/card_sound.mp3';

// Ассети
import lion from '../../../../public/assets/games/level_1/orderofobjects/images/lion.svg';
import bear from '../../../../public/assets/games/level_1/orderofobjects/images/Bear.svg';
import chicken from '../../../../public/assets/games/level_1/orderofobjects/images/chiken.svg';
import elephant from '../../../../public/assets/games/level_1/orderofobjects/images/elefant.svg';
import fox from '../../../../public/assets/games/level_1/orderofobjects/images/Fox.svg';
import pig from '../../../../public/assets/games/level_1/orderofobjects/images/pig.svg';

const ALL_ANIMALS = [lion, bear, chicken, elephant, fox, pig];

const MemoryMatch = ({ onSuccess }) => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isLocked, setIsLocked] = useState(true);

    const initGame = useCallback(async () => {
        const shuffledAnimals = [...ALL_ANIMALS].sort(() => Math.random() - 0.5).slice(0, 3);
        const pairCards = [...shuffledAnimals, ...shuffledAnimals]
            .sort(() => Math.random() - 0.5)
            .map((src, index) => ({ id: index, src }));

        setCards(pairCards);
        setMatchedIndices([]); 
        setFlippedIndices([]); 
        setIsLocked(true);

        await playSound(startSound);

        setFlippedIndices([0, 1, 2, 3, 4, 5]);

        setTimeout(() => {
            setFlippedIndices([]);
            setIsLocked(false);
        }, 2000);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleCardClick = async (index) => {
        if (isLocked || flippedIndices.includes(index) || matchedIndices.includes(index)) return;

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);
        playSound(flipSound, true);

        if (newFlipped.length === 2) {
        setIsLocked(true);
        const [firstIndex, secondIndex] = newFlipped;

        if (cards[firstIndex].src === cards[secondIndex].src) {
            setMatchedIndices(prev => [...prev, firstIndex, secondIndex]);
            setFlippedIndices([]);
            setIsLocked(false);
        } else {
            setTimeout(() => {
            setFlippedIndices([]);
            setIsLocked(false);
            }, 1000);
        }
        }
    };

    useEffect(() => {
        if (matchedIndices.length === 6 && cards.length > 0) {
        const handleWin = async () => {
            setShowConfetti(true);
            await playSound(winSound);
            if (onSuccess) onSuccess(true);
        };
        handleWin();
        }
    }, [matchedIndices, cards.length, onSuccess]);

    return (
        <div className={styles.gameWrapper}>
        <div className={styles.cardGrid}>
            {cards.map((card, index) => (
            <Card
                key={index}
                image={card.src}
                isFlipped={flippedIndices.includes(index) || matchedIndices.includes(index)}
                onClick={() => handleCardClick(index)}
            />
            ))}
        </div>
        <ConfettiPopper isTriggered={showConfetti} />
        </div>
    );
};

const Card = ({ image, isFlipped, onClick }) => {
    return (
        <div 
        className={`${styles.cardContainer} ${isFlipped ? styles.activeCard : ''}`} 
        onClick={onClick}
        style={{ zIndex: isFlipped ? 10 : 1 }}
        >
        <motion.div
            className={styles.cardInner}
            initial={false}
            animate={{ 
            rotateY: isFlipped ? 180 : 0,
            }}
            transition={{ 
            duration: 0.5, 
            type: 'spring', 
            stiffness: 150, 
            damping: 20 
            }}
        >
            <div className={styles.cardFront}>
                <span className={styles.pattern}>⭐</span>
            </div>

            <div className={styles.cardBack}>
            <img src={image} alt="animal" className={styles.cardImage} />
            </div>
        </motion.div>
        </div>
    );
};

export default MemoryMatch;