import React, { useState, useEffect, useCallback } from 'react';
import styles from '../assets/css/pages/Games.module.css';
import Play from '/assets/images/play.svg';

// UI Компоненти
import Header from '../components/ui/header.jsx';
import GameBackground from '../components/ui/background.jsx';
import VictoryScreen from '../components/ui/VictoryScreen.jsx';
import ProfileIcon from '/assets/images/Background/Profile.svg';
// Імпорти ігор
import Feed from '../components/games/level_1/feed.jsx';
import ABC from '../components/games/level_1/abc.jsx';
import OddOneOut from '../components/games/level_1/OddOneOut.jsx';
import OrderOfObjects from '../components/games/level_1/OrderOfObjects.jsx';
import Syllables from '../components/games/level_2/syllables.jsx';
import Baloons from '../components/games/level_2/Balloons.jsx';
import Puzzle from '../components/games/level_2/puzzle.jsx';
import Simon from '../components/games/level_2/simon.jsx';
import Match from '../components/games/level_3/match.jsx';
import Bubble from '../components/games/level_3/bubble.jsx';
import Pipes from '../components/games/level_3/pipes.jsx';
import Balance from '../components/games/level_3/mathBalanceGame.jsx';

const ALL_GAMES_REGISTRY = {
  language: { lvl_1: ABC, lvl_2: Syllables, lvl_3: Bubble },
  math: { lvl_1: Feed, lvl_2: Baloons, lvl_3: Balance },
  logic: { lvl_1: OddOneOut, lvl_2: Puzzle, lvl_3: Pipes },
  memory: { lvl_1: OrderOfObjects, lvl_2: Simon, lvl_3: Match }
};

const Games = () => {
  const [gamePool, setGamePool] = useState([]);
  const [CurrentGame, setCurrentGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bgStep, setBgStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // НОВИЙ СТАН: чи це перший захід на сторінку
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  // 1. Оновлений fetchSequence (тепер повертає дані, щоб ми могли використати їх одразу) http://localhost:8000
  const fetchSequence = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/game/config/`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      const readySequence = data.sequence.map((gameData, index) => ({
        id: gameData.id,
        Component: ALL_GAMES_REGISTRY[gameData.topic][gameData.lvl_key],
        instanceId: `${gameData.id}-${index}-${Date.now()}`
      }));

      setGamePool(readySequence);
      return readySequence; // Повертаємо для handleRestart
    } catch (e) {
      console.error("Помилка завантаження черги:", e);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchSequence(); 
  }, [fetchSequence]);

  // 2. Початок гри (натискання кнопки Плей)
  const handleStartGame = () => {
    if (gamePool.length === 0 || isTransitioning) return;
    
    setHasStartedOnce(true); // Фіксуємо, що гра вже запускалася
    setIsTransitioning(true);
    setBgStep(1); 
    
    setTimeout(() => {
      setCurrentGame(gamePool[0]);
      setIsPlaying(true);
      setIsTransitioning(false);
    }, 800);
  };

  const handleGameFinish = useCallback((result) => {
    if (!result || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentGame(null); 
    
    setProgress(prev => {
      const next = prev + 1;
      setBgStep(next + 1);
      
      if (next >= 5) {
        setTimeout(() => { 
          setIsPlaying(false); 
          setIsVictory(true); 
          setIsTransitioning(false); 
        }, 1000);
      } else {
        setTimeout(() => { 
          setCurrentGame(gamePool[next]); 
          setIsTransitioning(false); 
        }, 1000);
      }
      return next;
    });
  }, [gamePool, isTransitioning]);

  // 3. Оновлений Рестарт (Автоматичний перехід до наступного пулу)
  const handleRestart = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      // 1. Повідомляємо бекенд
      await fetch(`/game/complete/`, { credentials: 'include' });
      
      // 2. Отримуємо новий пул і чекаємо на результат
      const newPool = await fetchSequence();

      // 3. Скидаємо прогрес, але НЕ вимикаємо isPlaying
      setIsVictory(false);
      setProgress(0);
      setBgStep(1); // Одразу ставимо 1, бо ми переходимо до гри

      // 4. Одразу запускаємо першу гру з нового пулу
      if (newPool.length > 0) {
        setTimeout(() => {
          setCurrentGame(newPool[0]);
          setIsPlaying(true);
          setIsTransitioning(false);
        }, 800);
      }
      
    } catch (e) {
      console.error("Помилка при рестарті:", e);
      setIsTransitioning(false);
    }
  };

  if (isLoading && gamePool.length === 0) {
    return <div className={styles.loadingScreen}>Завантаження...</div>;
  }

  const handleProfileRedirect = () => {
    window.location.href = '/users/profile/'; 
  };

  return (
    <div className={styles.gameMainLayout}>
      <GameBackground step={bgStep} />
      {!isLoading && (
        <button 
          className={styles.profileButton} 
          onClick={handleProfileRedirect}
          title="Перейти до профілю"
        >
          <img src={ProfileIcon} alt="Profile" className={styles.profileIcon} />
        </button>
      )}
      {isVictory && <VictoryScreen onFinish={handleRestart} />}

      {isPlaying && !isVictory && <Header currentStep={progress} max={5} />}

      <main className={styles.content}>
        {/* 
            Кнопка показується ТІЛЬКИ якщо:
            1. Ми ще не почали грати (isPlaying === false)
            2. Це не екран перемоги
            3. Це ПЕРШИЙ запуск (hasStartedOnce === false)
        */}
        {!isPlaying && !isVictory && !isLoading && !hasStartedOnce && (
          <div className={`${styles.startScreen} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
            <button className={styles.playButtonContainer} onClick={handleStartGame}>
              <img src={Play} alt="Play" className={styles.playIcon} />
            </button>
          </div>
        )}

        {isPlaying && CurrentGame && !isVictory && (
          <div className={`${styles.gameWrapper} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
            <CurrentGame.Component
              key={CurrentGame.instanceId}
              onSuccess={handleGameFinish}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;