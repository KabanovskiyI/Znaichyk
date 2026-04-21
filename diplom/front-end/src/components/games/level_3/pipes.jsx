import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../../assets/css/components/games/level_3/pipes.module.css';
import { playSound } from '../../../utils/audioHelper.js';
import { generatePipeRound, checkPathConnections } from '../../../utils/pipeGameGenerator';
import ConfettiPopper from '../../ui/ConfettiPopper.jsx';
import winSound from '/assets/sounds/confetti-pop.mp3';
import startSound from '/assets/games/level_3/pipes/sounds/start_sound_pipes.mp3';

const PipeWordGame = ({ onSuccess }) => {
    const [grid, setGrid] = useState([]);
    const [isWon, setIsWon] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const initGame = useCallback(async () => {
        const roundData = generatePipeRound();

        setGrid(roundData.grid);
        setIsWon(false);
        setShowConfetti(false);

        await playSound(startSound);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handlePipeClick = async (clickedPipe, index) => {
        if (isWon || clickedPipe.isLocked || clickedPipe.type === 'empty' || clickedPipe.type === 'start' || clickedPipe.type === 'end') {
            return;
        }

        const newRotation = (clickedPipe.rotation + 90) % 360;

        const newGrid = grid.map((pipe, i) =>
            i === index ? { ...pipe, rotation: newRotation } : pipe
        );

        const { updatedGrid, isPathComplete } = checkPathConnections(newGrid);

        setGrid(updatedGrid);

        if (isPathComplete) {
            setIsWon(true);
            setShowConfetti(true);
            await playSound(winSound);
            if (onSuccess) setTimeout(() => onSuccess(true), 2500);
        }
    };

    return (
        <div className={styles.gameWrapper}>
            <div className={styles.gridContainer}>
                <AnimatePresence>
                    {grid.map((pipe, index) => (
                        <PipeCell
                            key={pipe.id}
                            pipeData={pipe}
                            onClick={() => handlePipeClick(pipe, index)}
                        />
                    ))}
                </AnimatePresence>
            </div>
            <ConfettiPopper isTriggered={showConfetti} />
        </div>
    );
};

const PipeCell = ({ pipeData, onClick }) => {
    const { type, rotation, isActive, isLocked } = pipeData;

    const svgContent = useMemo(() => {
        const strokeColor = isActive ? "#4b7a1a" : "#d1ccc0";
        const strokeWidth = "16";

        switch (type) {
            case 'straight':
                return <path d="M 50 0 L 50 100" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />;
            case 'corner':
                return <path d="M 50 0 Q 50 50 100 50" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />;
            case 'start':
                return <circle cx="50" cy="50" r="25" fill="#5da9e9" />; 
            case 'end':
                return <circle cx="50" cy="50" r="25" fill={isActive ? "#8ec549" : "#ef4444"} />; 
            default:
                return null; 
        }
    }, [type, isActive]);

    if (type === 'empty') {
        return <div className={styles.emptyCell} />;
    }

    const springTransition = {
        type: 'spring',
        stiffness: 400,
        damping: 15,
        mass: 0.5
    };

    return (
        <motion.div
            className={`${styles.pipeCell} ${isLocked ? styles.locked : ''}`}
            animate={{ 
                rotate: rotation, // Основне обертання плитки
                scale: isActive && !isLocked ? 1.05 : 1 
            }}
            transition={springTransition} // Швидка анімація
            whileTap={!isLocked ? { scale: 0.9 } : {}}
            onClick={onClick}
        >
            <div className={styles.pipeInner}>
                <svg viewBox="0 0 100 100" className={styles.pipeSvg}>
                    {svgContent}
                </svg>
                
                {/* Оновлений блок замочка */}
                {isLocked && type !== 'start' && type !== 'end' && (
                    <motion.div 
                        className={styles.lockIcon}
                        // Застосовуємо зворотну ротацію: -rotation
                        animate={{ rotate: -rotation }} 
                        // Синхронізуємо швидкість із батьківським елементом
                        transition={springTransition} 
                    >
                        🔒
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default PipeWordGame;