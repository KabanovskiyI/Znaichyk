import React, { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const ConfettiPopper = ({ isTriggered, onComplete }) => {
  const fire = useCallback(() => {
    // Настройки "выстрела"
    const duration = 3 * 1000; // 3 секунды
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        if (onComplete) onComplete(); // Вызываем колбэк по окончании
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Выстрел звездочками и конфетти
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        shapes: ['star'],
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        shapes: ['circle'],
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });
    }, 250);
  }, [onComplete]);

  useEffect(() => {
    if (isTriggered) {
      fire();
    }
  }, [isTriggered, fire]);

  return null; // Компонент ничего не рисует сам, только запускает JS-эффект
};

export default ConfettiPopper;