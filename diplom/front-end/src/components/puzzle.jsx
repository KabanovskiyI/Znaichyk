import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../public/assets/css/puzzle.module.css';
import { playSound } from '../utils/audioHelper.js';
import { getRandomPuzzleImage } from '../utils/puzzleHelper.js'; // Наша нова утиліта
import ConfettiPopper from './ConfettiPopper';

import winSound from '../../public/assets/sounds/confetti-pop.mp3';

const GRID_SIZE = 3; 
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const DESKTOP_PIECE_SIZE = 150; 
const CARD_BORDER = 4;

const ImagePuzzle = ({ onSuccess }) => {
  const [imageUrl, setImageUrl] = useState(null); // Шлях до обраної картинки
  const [showConfetti, setShowConfetti] = useState(false);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [bgMetrics, setBgMetrics] = useState({ width: '0px', height: '0px', offsetX: 0, offsetY: 0 });
  const [pieceSize, setPieceSize] = useState(DESKTOP_PIECE_SIZE);

  useEffect(() => {
    const randomImg = getRandomPuzzleImage();
    setImageUrl(randomImg);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - 40; 
      const calculatedSize = Math.min(DESKTOP_PIECE_SIZE, availableWidth / GRID_SIZE);
      setPieceSize(calculatedSize);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const imgRatio = img.width / img.height;
      const boardSize = GRID_SIZE * pieceSize;
      let bgW, bgH, offX = 0, offY = 0;

      if (imgRatio > 1) {
        bgH = boardSize;
        bgW = boardSize * imgRatio;
        offX = (bgW - boardSize) / 2;
      } else {
        bgW = boardSize;
        bgH = boardSize / imgRatio;
        offY = (bgH - boardSize) / 2;
      }

      setBgMetrics({
        width: `${bgW}px`,
        height: `${bgH}px`,
        offsetX: offX,
        offsetY: offY
      });

      // Перемішуємо індекси тільки після завантаження картинки
      if (shuffledIndices.length === 0) {
        const indices = Array.from({ length: TILE_COUNT }, (_, i) => i);
        setShuffledIndices([...indices].sort(() => Math.random() - 0.5));
      }
    };
  }, [imageUrl, pieceSize, shuffledIndices.length]);

  useEffect(() => {
    if (placedPieces.length === TILE_COUNT && TILE_COUNT > 0) {
      const handleVictory = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowConfetti(true);
        await playSound(winSound);
        if (onSuccess) onSuccess(true);
      };
      handleVictory();
    }
  }, [placedPieces, onSuccess]);

  const handleDragEnd = (event, info, index) => {
    const boardElement = document.getElementById('puzzle-board');
    if (!boardElement) return;
    const rect = boardElement.getBoundingClientRect();
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    
    const targetX = rect.left + col * pieceSize + pieceSize / 2;
    const targetY = rect.top + row * pieceSize + pieceSize / 2;
    const threshold = pieceSize / 1.6;

    if (Math.abs(info.point.x - targetX) < threshold && Math.abs(info.point.y - targetY) < threshold) {
      if (!placedPieces.includes(index)) {
        setPlacedPieces(prev => [...prev, index]);
      }
    }
  };

  return (
    <div className={styles.puzzleWrapper}>
      <div 
        id="puzzle-board" 
        className={styles.board}
        style={{
          width: `${pieceSize * GRID_SIZE}px`,
          height: `${pieceSize * GRID_SIZE}px`,
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${pieceSize}px)`,
          '--hint-url': `url(${imageUrl})`,
          '--hint-size-w': bgMetrics.width,
          '--hint-size-h': bgMetrics.height,
          '--hint-pos-x': `-${bgMetrics.offsetX}px`,
          '--hint-pos-y': `-${bgMetrics.offsetY}px`,
        }}
      >
        {Array.from({ length: TILE_COUNT }).map((_, i) => (
          <div key={`slot-${i}`} className={styles.slot} style={{ width: pieceSize, height: pieceSize }}>
            {placedPieces.includes(i) && (
              <Piece 
                index={i} imageUrl={imageUrl} isFixed={true} 
                size={pieceSize} bgMetrics={bgMetrics} gridSize={GRID_SIZE} 
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.tray} style={{ height: `${pieceSize + 60}px` }}>
        <AnimatePresence>
          {shuffledIndices
            .filter(index => !placedPieces.includes(index))
            .map((index, i) => (
              <motion.div
                key={`piece-${index}`}
                className={styles.draggableWrapper}
                style={{ zIndex: TILE_COUNT - i, left: `calc(50% - ${pieceSize/2}px)` }}
                initial={{ x: 0, y: 0, rotate: -5 + Math.random() * 10 }}
                drag
                dragSnapToOrigin={true}
                onDragEnd={(e, info) => handleDragEnd(e, info, index)}
                whileDrag={{ scale: 1.1, rotate: 0, zIndex: 100 }}
              >
                <Piece 
                  index={index} imageUrl={imageUrl} size={pieceSize} 
                  bgMetrics={bgMetrics} border={CARD_BORDER} gridSize={GRID_SIZE}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <ConfettiPopper isTriggered={showConfetti} />
    </div>
  );
};

const Piece = ({ index, imageUrl, isFixed = false, size, bgMetrics, border = 0, gridSize }) => {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const bgX = -(col * size + bgMetrics.offsetX);
  const bgY = -(row * size + bgMetrics.offsetY);

  return (
    <div 
      className={`${styles.piece} ${isFixed ? styles.fixed : styles.card}`} 
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${bgMetrics.width} ${bgMetrics.height}`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundPosition: isFixed 
          ? `${bgX}px ${bgY}px` 
          : `${bgX + border}px ${bgY + border}px`
      }} 
    />
  );
};

export default ImagePuzzle;