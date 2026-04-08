import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../../assets/css/components/games/level_3/bubbles.module.css';
import { playSound } from '../../../utils/audioHelper.js';
import { generateBubbleRound } from '../../../utils/wordGameGenerator';
import ConfettiPopper from '../../ui/ConfettiPopper.jsx';


import winSound from '/assets/sounds/confetti-pop.mp3';
import startSound from '/assets/games/level_3/bubble/sounds/start_sound.mp3';

const BubbleWordGame = ({ onSuccess }) => {
    const [bubbles, setBubbles] = useState([]);
    const [isWon, setIsWon] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [poppedId, setPoppedId] = useState(null);

    const initGame = useCallback(async () => {
        const roundData = generateBubbleRound();
        
        // Ініціалізуємо кульки з додатковими властивостями для анімації
        const initializedBubbles = roundData.map(b => ({
            ...b,
            recoilX: 0,
            recoilY: 0,
            recoilScale: 1,
            isPushed: false
        }));

        setBubbles(initializedBubbles);
        setIsWon(false);
        setShowConfetti(false);
        setPoppedId(null);
        await playSound(startSound);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleBubbleClick = async (bubble, index) => {
        if (isWon) return;

        if (bubble.isCorrect) {
            setPoppedId(index);
            setIsWon(true);
            setShowConfetti(true);
            await playSound(winSound);
            if (onSuccess) setTimeout(() => onSuccess(true), 2000);
        } else {
            setBubbles(prev => prev.map((b, i) => {
                if (i === index) {
                    return {
                        ...b,
                        isPushed: true,
                        recoilX: Math.floor(Math.random() * 80) - 40, 
                        recoilY: Math.floor(Math.random() * 80) - 40,
                        recoilScale: b.recoilScale * 0.9
                    };
                }
                return b;
            }));
        }
    };

    return (
        <div className={styles.gameWrapper}>
            <div className={styles.bubbleContainer}>
                <AnimatePresence>
                    {bubbles.map((bubble, index) => (
                        <Bubble
                            key={`${bubble.text}-${index}`}
                            bubbleData={bubble}
                            isPopped={poppedId === index}
                            onClick={() => 
                                handleBubbleClick(bubble, index)
                            }
                        />
                    ))}
                </AnimatePresence>
            </div>
            <ConfettiPopper isTriggered={showConfetti} />
        </div>
    );
};

const Bubble = ({ bubbleData, onClick, isPopped }) => {
    const { text, isCorrect, recoilX, recoilY, recoilScale, isPushed } = bubbleData;

    const fontSize = useMemo(() => {
        const baseSize = 3.2; // rem
        if (text.length <= 8) return `${baseSize}rem`;
        
        const extraLetters = text.length - 8;
        const reduction = extraLetters * 0.08;
        const newSize = Math.max(baseSize * (1 - reduction), 1.5); 
        return `${newSize}rem`;
    }, [text]);

    return (
        <motion.div
            className={styles.bubble}
            style={{ zIndex: isCorrect ? 10 : 1 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
                isPopped ? { 
                    scale: 2, 
                    opacity: 0,
                    transition: { duration: 0.3, ease: "easeOut" } 
                } : { 
                    scale: recoilScale, 
                    opacity: 1,
                    x: recoilX,
                    y: recoilY,
                    transition: { 
                        type: 'spring', 
                        stiffness: isPushed ? 400 : 150, 
                        damping: 15 
                    }
                }
            }
            // Постійне плавання відносно нової точки (recoilY)
            whileInView={{
                y: [recoilY, recoilY - 15, recoilY],
                transition: { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }
            }}
            whileTap={!isPopped && isCorrect ? { scale: 0.9 } : {}}
            onClick={onClick}
        >
            <div className={styles.bubbleInner}>
                <span 
                    className={styles.wordText} 
                    style={{ fontSize: fontSize }}
                >
                    {text}
                </span>
                <div className={styles.reflectionMain}></div>
                <div className={styles.reflectionSecondary}></div>
            </div>
        </motion.div>
    );
};

export default BubbleWordGame;