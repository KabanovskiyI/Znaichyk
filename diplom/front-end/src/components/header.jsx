import React, { useRef, useEffect, useState } from 'react';
import styles from '../../public/assets/css/header.module.css';

const TurtleProgressBar = ({ currentStep = 0 }) => {
  const totalSteps = 5;
  const pathRef = useRef(null);
  const [totalLength, setTotalLength] = useState(0);
  
  // Состояние для скрытия капусты
  const [isCabbageEaten, setIsCabbageEaten] = useState(false);

  const safeStep = Math.min(Math.max(currentStep, 0), totalSteps);
  const progress = safeStep / totalSteps;
  const pathData = "M 20 60 C 120 10, 180 110, 300 60 C 420 10, 480 110, 580 60";

  useEffect(() => {
    if (pathRef.current) {
      setTotalLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Логика поедания капусты
  useEffect(() => {
    if (currentStep >= totalSteps) {
      const timer = setTimeout(() => {
        setIsCabbageEaten(true);
      }, 150); 
      
      return () => clearTimeout(timer);
    } else {
      // Если игра сбросилась или шагов меньше 5 — капуста снова на месте
      setIsCabbageEaten(false);
    }
  }, [currentStep, totalSteps]);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.headerWrapper}>
        <svg viewBox="0 0 600 120" className={styles.progressSvg}>
          
          <path
            d={pathData}
            fill="transparent"
            stroke="#E6D2A7"
            strokeWidth="18"
            strokeLinecap="round"
            style={{ opacity: 0.2 }}
          />

          <path
            ref={pathRef}
            d={pathData}
            className={styles.trackSand}
            fill="transparent"
            stroke="#E6D2A7" 
            strokeWidth="18"
            strokeLinecap="round"
            style={{
              strokeDasharray: totalLength || 700,
              strokeDashoffset: (totalLength || 700) * (1 - progress),
              transition: 'stroke-dashoffset 0.5s ease-out'
            }}
          />

          {/* Финиш — Капуста (Исчезает по условию) */}
          {!isCabbageEaten && (
            <text 
              x="565" 
              y="72" 
              className={styles.cabbageIcon}
              style={{ transition: 'opacity 0.2s ease' }} // Плавное исчезновение
            >
              🥬
            </text>
          )}

          <g style={{ 
            offsetPath: `path('${pathData}')`,
            offsetDistance: `${progress * 100}%`,
            transition: 'offset-distance 0.5s ease-out'
          }}>
            <text 
              transform="scale(-1, 1)" 
              dominantBaseline="middle" 
              textAnchor="middle" 
              className={styles.turtleIcon}
              style={{ fontSize: '30px' }}
            >
              🐢
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default TurtleProgressBar;