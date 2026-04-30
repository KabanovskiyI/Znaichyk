import { useEffect, useState, useRef } from 'react';
import { playSound } from '../../utils/audioHelper.js';
import ConfettiPopper from './ConfettiPopper';
import styles from '../../assets/css/components/ui/victory.module.css';

import trophyImageUrl from '/assets/images/cup.svg'; 

const VictoryScreen = ({ onFinish }) => {
    const [isConfettiActive, setIsConfettiActive] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    
    // ДОДАНО: Реф для відстеження того, чи вже запускалась анімація
    const hasStarted = useRef(false); 

    useEffect(() => {
        // Якщо послідовність вже запущена — ігноруємо повторні виклики
        if (hasStarted.current) return;
        hasStarted.current = true;

        const runVictorySequence = async () => {
            setIsConfettiActive(true);

            try {
                // Тепер звук точно програється лише один раз
                await playSound('/assets/sounds/winner_sound.mp3', true);
            } catch (e) {
                console.error("Помилка звуку:", e);
            }
            
            setTimeout(() => {
                setIsExiting(true);
            }, 1700);

            setTimeout(() => {
                onFinish();
            }, 2000); 
        };

        runVictorySequence();
    }, [onFinish]);

    return (
        <div className={styles.victoryOverlay}>
            <ConfettiPopper isTriggered={isConfettiActive} />

            <div className={`${styles.victoryCard} ${isExiting ? styles.fadeOut : ''}`}>
                <div className={styles.trophyContainer}>
                    <img
                        src={trophyImageUrl}
                        alt="Кубок перемоги"
                        className={styles.trophyImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default VictoryScreen;