import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../../assets/css/components/games/level_3/balance.module.css';
import { playSound } from '../../../utils/audioHelper.js';
import { generateBalanceRound } from '../../../utils/balanceGameGenerator';
import ConfettiPopper from '../../ui/ConfettiPopper.jsx';

// Звуки
import winSound from '/assets/sounds/confetti-pop.mp3';
import startSound from '/assets/games/level_3/balance/sounds/start_sound_balance.mp3';
const MAIN_WEIGHT_COLOR = '#5d6d7e'; 

const Weight = ({ item, source, onMoveEnd, isPlaced, value }) => {
    const isDraggable = !item.isFixed;

    // Оновлені зменшені розміри
    const baseSize = 38; // Було 45
    const extraSize = value * 3.5; // Було 6 - тепер ростуть плавно
    const width = baseSize + extraSize;
    const height = (baseSize + extraSize) * 0.85;
    const fontSize = 0.9 + (value * 0.05); // Трохи менший шрифт для балансу

    return (
        <motion.div
            layout
            initial={isPlaced ? { scale: 0.5, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            drag={isDraggable}
            dragSnapToOrigin
            dragElastic={0.05}
            whileDrag={isDraggable ? { scale: 1.1, zIndex: 100 } : {}}
            onDragEnd={(e, info) => isDraggable && onMoveEnd(e, info, item, source)}
            className={`
                ${styles.weight} 
                ${isPlaced ? styles.inPlate : ''} 
                ${item.isFixed ? styles.fixedWeight : ''}
            `}
            style={{ 
                width: `${width}px`,
                height: `${height}px`,
                fontSize: `${fontSize}rem`,
                backgroundColor: MAIN_WEIGHT_COLOR 
            }}
        >
            {value}
        </motion.div>
    );
};

const MathBalanceGame = ({ onSuccess }) => {
    const [gameData, setGameData] = useState(null);
    const [plates, setPlates] = useState({ left: [], right: [] });
    const [isWon, setIsWon] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    
    const leftPlateRef = useRef(null);
    const rightPlateRef = useRef(null);

    const initGame = useCallback(async () => {
        const data = generateBalanceRound();
        setGameData(data);
        setIsWon(false);
        setShowConfetti(false);

        const startItemWithLock = { ...data.startItem, isFixed: true };

        if (data.startPlate === 0) {
            setPlates({ left: [startItemWithLock], right: [] });
        } else {
            setPlates({ left: [], right: [startItemWithLock] });
        }
        await playSound(startSound);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const leftSum = useMemo(() => plates.left.reduce((a, b) => a + b.value, 0), [plates]);
    const rightSum = useMemo(() => plates.right.reduce((a, b) => a + b.value, 0), [plates]);

    const tiltAngle = useMemo(() => {
        const diff = rightSum - leftSum; 
        return Math.max(Math.min(diff * 4, 18), -18);
    }, [leftSum, rightSum]);

    useEffect(() => {
        if (leftSum === rightSum && leftSum !== 0 && !isWon) {
            const totalItems = plates.left.length + plates.right.length;
            if (totalItems === 3) handleWin();
        }
    }, [leftSum, rightSum, plates, isWon]);

    const handleWin = async () => {
        setIsWon(true);
        setShowConfetti(true);
        await playSound(winSound);
        if (onSuccess) setTimeout(() => onSuccess(true), 2500);
    };

    const handleDragEnd = (event, info, opt, source) => {
        const x = info.point.x;
        const y = info.point.y;
        const leftRect = leftPlateRef.current.getBoundingClientRect();
        const rightRect = rightPlateRef.current.getBoundingClientRect();

        const removeFunc = (prev) => {
            if (source === 'left') return prev.left.filter(p => p.id !== opt.id);
            if (source === 'right') return prev.right.filter(p => p.id !== opt.id);
            return prev[source]; 
        };

        if (x > leftRect.left && x < leftRect.right && y > leftRect.top && y < leftRect.bottom + 60) {
            updatePosition(opt, 'left', source, removeFunc);
        } else if (x > rightRect.left && x < rightRect.right && y > rightRect.top && y < rightRect.bottom + 60) {
            updatePosition(opt, 'right', source, removeFunc);
        }
    };

    const updatePosition = (opt, side, source, removeFunc) => {
        setPlates(prev => {
            const next = { ...prev };
            if (source !== 'pool') {
                next.left = source === 'left' ? removeFunc(prev) : prev.left;
                next.right = source === 'right' ? removeFunc(prev) : prev.right;
            }
            if (source !== side) next[side] = [...next[side], opt];
            return next;
        });
    };

    if (!gameData) return null;

    const pool = gameData.options.filter(opt => 
        !plates.left.some(p => p.id === opt.id) && !plates.right.some(p => p.id === opt.id)
    );

    return (
        <div className={styles.gameWrapper}>
            <div className={styles.stage}>
                <div className={styles.mainStand}>
                    <div className={styles.verticalPost} />
                    <div className={styles.base} />
                </div>

                <motion.div 
                    className={styles.balanceBeam}
                    animate={{ rotate: tiltAngle }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                    <div className={styles.pivotPoint} />

                    {/* Ліва шалька */}
                    <motion.div className={styles.plateAssembly} style={{ left: '-90px' }} animate={{ rotate: -tiltAngle }}>
                        <div className={`${styles.rope} ${styles.ropeLeft}`} />
                        <div className={`${styles.rope} ${styles.ropeRight}`} />
                        <div ref={leftPlateRef} className={styles.plateBowl}>
                            <AnimatePresence>
                                {plates.left.map((item) => (
                                    <Weight key={item.id} item={item} value={item.value} source="left" onMoveEnd={handleDragEnd} isPlaced={true} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Права шалька */}
                    <motion.div className={styles.plateAssembly} style={{ right: '-90px' }} animate={{ rotate: -tiltAngle }}>
                        <div className={`${styles.rope} ${styles.ropeLeft}`} />
                        <div className={`${styles.rope} ${styles.ropeRight}`} />
                        <div ref={rightPlateRef} className={styles.plateBowl}>
                            <AnimatePresence>
                                {plates.right.map((item) => (
                                    <Weight key={item.id} item={item} value={item.value} source="right" onMoveEnd={handleDragEnd} isPlaced={true} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className={styles.optionsGrid}>
                {pool.map((opt) => (
                    <Weight key={opt.id} item={opt} value={opt.value} source="pool" onMoveEnd={handleDragEnd} isPlaced={false} />
                ))}
            </div>

            <ConfettiPopper isTriggered={showConfetti} />
        </div>
    );
};

export default MathBalanceGame;