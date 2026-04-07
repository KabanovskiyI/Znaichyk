import React, { useState, useEffect, useRef } from 'react';
import styles from '../../../../public/assets/css/OrderOfObjects.module.css';
import ConfettiPopper from '../../ConfettiPopper';
import { playSound } from '../../../utils/audioHelper.js';

import winSound from '../../../../public/assets/sounds/confetti-pop.mp3';
import startSound from '../../../../public/assets/games/level_1/orderofobjects/sounds/task_OrderOfObjects.mp3';

import lion from '../../../../public/assets/games/level_1/orderofobjects/images/lion.svg';
import bear from '../../../../public/assets/games/level_1/orderofobjects/images/Bear.svg';
import chicken from '../../../../public/assets/games/level_1/orderofobjects/images/chiken.svg';
import elephant from '../../../../public/assets/games/level_1/orderofobjects/images/elefant.svg';
import fox from '../../../../public/assets/games/level_1/orderofobjects/images/Fox.svg';
import koala from '../../../../public/assets/games/level_1/orderofobjects/images/koala.svg';
import lamb from '../../../../public/assets/games/level_1/orderofobjects/images/lamb.svg';
import owl from '../../../../public/assets/games/level_1/orderofobjects/images/Owl.svg';
import pig from '../../../../public/assets/games/level_1/orderofobjects/images/pig.svg';

import btnBlue from '../../../../public/assets/games/level_1/orderofobjects/images/Button_blue.svg';
import btnGreen from '../../../../public/assets/games/level_1/orderofobjects/images/Button_green.svg';
import btnPink from '../../../../public/assets/games/level_1/orderofobjects/images/Button_pink.svg';
import btnRed from '../../../../public/assets/games/level_1/orderofobjects/images/Button_red.svg';

const ANIMAL_ASSETS = [lion, bear, chicken, elephant, fox, koala, lamb, owl, pig];
const CARD_BGS = [btnBlue, btnGreen, btnPink, btnRed];
const SLOT_WIDTH = 300; 

const MemoryShuffle = ({ onSuccess }) => {
    const [items, setItems] = useState([]);
    const [step, setStep] = useState('memorize');
    const [draggingId, setDraggingId] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    
    const itemsRef = useRef([]); 
    const startXRef = useRef(0);
    const draggingIdRef = useRef(null); 

    // Покращений алгоритм перемішування (Fisher-Yates)
    const shuffleArray = (array) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const initGame = () => {
        playSound(startSound);

        const selectedAnimals = shuffleArray(ANIMAL_ASSETS).slice(0, 4);
        const bgs = shuffleArray(CARD_BGS);
        const initialItems = selectedAnimals.map((src, index) => ({
            id: `animal-${index}`,
            src: src,
            background: bgs[index],
            originalPos: index, 
            pos: index,          
            isLocked: false      
        }));
        setItems(initialItems);
        itemsRef.current = initialItems;
        setTimeout(() => startShuffle(), 3000);
    };

    const startShuffle = () => {
        setStep('shuffle');
        
        let newPositions;
        let isDifferent = false;

        // Гілка логіки: крутимо рандом, поки він не видасть хоча б одну зміну позиції
        // Для 4-х елементів це спрацює миттєво
        while (!isDifferent) {
            newPositions = shuffleArray([0, 1, 2, 3]);
            // Перевіряємо, чи масив не ідентичний [0, 1, 2, 3]
            isDifferent = newPositions.some((pos, idx) => pos !== idx);
        }

        const shuffled = itemsRef.current.map((item, idx) => ({
            ...item,
            pos: newPositions[idx],
            isLocked: false
        }));

        setItems(shuffled);
        itemsRef.current = shuffled;
        setTimeout(() => setStep('play'), 1500);
    };

    const handleStart = (e, item) => {
        if (step !== 'play' || item.isLocked) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        setDraggingId(item.id);
        draggingIdRef.current = item.id;
        startXRef.current = clientX;
    };

    useEffect(() => {
        const handleMove = (e) => {
            if (!draggingIdRef.current) return;

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const diff = clientX - startXRef.current;
            setDragOffset(diff);

            const currentItems = itemsRef.current;
            const draggedItem = currentItems.find(i => i.id === draggingIdRef.current);
            if (!draggedItem) return;

            const targetPos = Math.max(0, Math.min(3, Math.round((draggedItem.pos * SLOT_WIDTH + diff) / SLOT_WIDTH)));

            if (targetPos !== draggedItem.pos) {
                const targetItem = currentItems.find(i => i.pos === targetPos);
                
                if (targetItem && !targetItem.isLocked) {
                    const nextItems = currentItems.map(item => {
                        if (item.id === draggingIdRef.current) return { ...item, pos: targetPos };
                        if (item.id === targetItem.id) return { ...item, pos: draggedItem.pos };
                        return item;
                    });
                    
                    startXRef.current += (targetPos - draggedItem.pos) * SLOT_WIDTH;
                    setDragOffset(clientX - startXRef.current);
                    
                    setItems(nextItems);
                    itemsRef.current = nextItems;
                }
            }
        };

        const handleEnd = () => {
            if (!draggingIdRef.current) return;

            const finalItems = itemsRef.current.map(item => {
                if (item.pos === item.originalPos) {
                    return { ...item, isLocked: true };
                }
                return item;
            });

            setItems(finalItems);
            itemsRef.current = finalItems;
            setDraggingId(null);
            draggingIdRef.current = null;
            setDragOffset(0);

            if (finalItems.every(i => i.isLocked)) {
                playSound(winSound);
                setShowConfetti(true);
                
                setTimeout(() => {
                    setStep('win');
                    if (onSuccess) onSuccess(true);
                }, 500);
            }
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, []); 

    useEffect(() => {
        initGame();
    }, []);

    return (
        <div className={styles.gameContainer}>
            <div className={styles.gridContainer}>
                {items.map((item) => {
                    const isDragging = draggingId === item.id;
                    return (
                        <div
                            key={item.id}
                            onMouseDown={(e) => handleStart(e, item)}
                            onTouchStart={(e) => handleStart(e, item)}
                            className={`
                                ${styles.gameCard} 
                                ${item.isLocked ? styles.locked : ''} 
                                ${isDragging ? styles.dragging : ''}
                                ${step === 'shuffle' ? styles.shuffling : ''}
                            `}
                            style={{ 
                                '--offset': item.pos,
                                '--dragX': isDragging ? `${dragOffset}px` : '0px'
                            }}
                        >
                            <img src={item.background} alt="bg" className={styles.cardBg} />
                            <img src={item.src} alt="animal" className={styles.cardItem} />
                            {item.isLocked && step === 'play' && <div className={styles.lockBadge}>✨</div>}
                        </div>
                    );
                })}
            </div>
            <ConfettiPopper isTriggered={showConfetti} />
        </div>
    );
};

export default MemoryShuffle;