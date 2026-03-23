import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiPopper from './ConfettiPopper';
import styles from '../../public/assets/css/feed.module.css';

import { playSound } from '../utils/audioHelper.js'; 

import dogImg from '../../public/assets/images/feed/dog.svg';
import boneImg from '../../public/assets/images/feed/bone.svg';
import boneShadowImg from '../../public/assets/images/feed/bone_shadow.svg';

import wow from '../../public/assets/sounds/feed/wow.mp3';
import win from '../../public/assets/sounds/confetti-pop.mp3';
import task1 from '../../public/assets/sounds/feed/task_1.mp3';
import task2 from '../../public/assets/sounds/feed/task_2.mp3';
import task3 from '../../public/assets/sounds/feed/task_3.mp3';
import task4 from '../../public/assets/sounds/feed/task_4.mp3';
import task5 from '../../public/assets/sounds/feed/task_5.mp3';

import n1 from '../../public/assets/sounds/feed/1.mp3';
import n2 from '../../public/assets/sounds/feed/2.mp3';
import n3 from '../../public/assets/sounds/feed/3.mp3';
import n4 from '../../public/assets/sounds/feed/4.mp3';
import n5 from '../../public/assets/sounds/feed/5.mp3';

const TASK_SOUNDS = { 1: task1, 2: task2, 3: task3, 4: task4, 5: task5 };
const NUMBER_SOUNDS = { 1: n1, 2: n2, 3: n3, 4: n4, 5: n5 };

const EXTRA_BONES = 2;

const Feed = ({ onSuccess }) => {
    // Количество необходимых косточек (от 2 до 5)
    const [showConfetti, setShowConfetti] = useState(false);
    // Используем useMemo, чтобы число не менялось при ререндерах
    const totalNeeded = useMemo(() => Math.floor(Math.random() * 4) + 2, []);
    const spawnCount = totalNeeded + EXTRA_BONES;
    const [fedCount, setFedCount] = useState(0);

    // --- ВОСПРОИЗВЕДЕНИЕ СТАРТОВОГО ЗАДАНИЯ ---
    useEffect(() => {
        const startSoundSource = TASK_SOUNDS[totalNeeded];
        if (startSoundSource) {
            playSound(startSoundSource);
        }
        // Убрали сложную логику очистки через ref, так как audioHelper сам контролирует дублирование,
        // а при размонтировании звук доиграет до конца (стандартное поведение браузера для простых аудио)
    }, [totalNeeded]);

    // --- АЛГОРИТМ ГЕНЕРАЦИИ КОСТЕЙ (Без изменений) ---
    const bonePositions = useMemo(() => {
        const positions = [];
        const minDistanceBetweenBones = 16; 
        const forbiddenZone = { 
            xMin: 30, xMax: 70, 
            yMin: 5,  yMax: 50  
        };

        let attempts = 0;
        const maxAttempts = 200; 

        while (positions.length < spawnCount && attempts < maxAttempts) {
            attempts++;
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;

            const isInsideDogZone = (
                x > forbiddenZone.xMin && x < forbiddenZone.xMax &&
                y > forbiddenZone.yMin && y < forbiddenZone.yMax
            );

            if (isInsideDogZone) continue;

            let tooClose = false;
            for (const pos of positions) {
                const distance = Math.sqrt(
                    Math.pow(x - pos.numericX, 2) + Math.pow(y - pos.numericY, 2)
                );
                
                if (distance < minDistanceBetweenBones) {
                    tooClose = true;
                    break;
                }
            }

            if (tooClose) continue;

            positions.push({ 
                id: positions.length, 
                x: `${x}%`, 
                y: `${y}%`,
                numericX: x, 
                numericY: y 
            });
        }

        return positions;
    }, [spawnCount]);

    const [bones, setBones] = useState(bonePositions);

    const handleDragEnd = async (event, info, id) => {
        const dogElement = document.getElementById('dog-target');
        if (!dogElement) return;

        const dogRect = dogElement.getBoundingClientRect();
        const dogCenterX = dogRect.left + dogRect.width / 2;
        const dogCenterY = dogRect.top + dogRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(info.point.x - dogCenterX, 2) + 
            Math.pow(info.point.y - dogCenterY, 2)
        );

        if (distance < 180 && fedCount < totalNeeded) {
            const newCount = fedCount + 1;
            setFedCount(newCount);
            setBones(prev => prev.filter(bone => bone.id !== id));

            // Используем импортированный playSound
            playSound(NUMBER_SOUNDS[newCount]);

            if (newCount === totalNeeded) {
                setShowConfetti(true);
                
                // Ждем окончания звука победы
                await playSound(win);
                
                // Небольшая задержка перед колбэком
                await new Promise(resolve => setTimeout(resolve, 300));

                if (onSuccess) {
                    onSuccess(true);
                }
            }
        }
    };

    const dogReactionAnimation = {
        scale: [1, 1.15, 0.9, 1], 
        rotate: [0, -5, 5, 0],   
        transition: { 
            duration: 0.5, 
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 1] 
        }
    };

    return (
        <div className={styles.gameContainer}>
            <div className={styles.petZone}>
                <div className={styles.slotsContainer}>
                    {Array.from({ length: totalNeeded }).map((_, i) => (
                        <div key={i} className={styles.boneSlot}>
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={i < fedCount ? 'bone' : 'shadow'}
                                    src={i < fedCount ? boneImg : boneShadowImg} 
                                    className={i < fedCount ? styles.activeBone : styles.shadowBone}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: i < fedCount ? 1 : 0.2 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <motion.div 
                    id="dog-target" 
                    className={styles.dogCharacter}
                    onClick={() => playSound(wow)} // Теперь playSound берется из импорта
                    style={{ cursor: 'pointer' }}
                    whileTap={{ scale: 0.9 }}
                    key={fedCount}
                    animate={fedCount > 0 ? dogReactionAnimation : { scale: 1 }}
                >
                    <img src={dogImg} alt="Doggy" draggable={false} />
                </motion.div>
            </div>

            <AnimatePresence>
                {bones.map((bone) => (
                    <motion.div
                        key={bone.id}
                        drag
                        dragSnapToOrigin
                        dragMomentum={false}
                        onDragEnd={(e, info) => handleDragEnd(e, info, bone.id)}
                        className={styles.draggableBone}
                        style={{ left: bone.x, top: bone.y, position: 'absolute' }}
                        
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ 
                            scale: 0,           
                            rotate: 720,        
                            opacity: 0,         
                            transition: { duration: 0.5, ease: "backIn" } 
                        }}
                    >
                        <img src={boneImg} alt="Bone" draggable={false} />
                    </motion.div>
                ))}
            </AnimatePresence>
            <ConfettiPopper isTriggered={showConfetti} />
        </div>
    );
};

export default Feed;