import React, { useState, useMemo, useCallback } from 'react';
import '../assets/css/pages/Games.css';
import Play from '/assets/images/play.svg';
import Header from '../components/ui/header.jsx';
import GameBackground from '../components/ui/background.jsx';

import Feed from '../components/games/level_1/feed.jsx';
import ABC from '../components/games/level_1/abc.jsx';
import OddOneOut from '../components/games/level_1/OddOneOut.jsx';
import OrderOfObjects from '../components/games/level_1/OrderOfObjects.jsx';
import Syllables from '../components/games/level_2/syllables.jsx';
import Baloons from '../components/games/level_2/Balloons.jsx';
import Puzzle from '../components/games/level_2/puzzle.jsx';
import Simon from '../components/games/level_2/simon.jsx';
import Match from '../components/games/level_3/match.jsx';
const MAX_PROGRESS = 5;

const Games = () => {
  // Список игр
  const gamePool = useMemo(() => [
    //{ id: 'feed', Component: Feed },
    //{ id: 'balloons', Component: Baloons },
    //{ id: 'abc', Component: ABC },
    //{ id: 'odd-one-out', Component: OddOneOut },
    //{ id: 'order-of-objects', Component: OrderOfObjects },
    //{ id: 'syllables', Component: Syllables },
    //{ id: 'puzzle', Component: Puzzle },
    //{ id: 'simon', Component: Simon },
    { id: 'match', Component: Match },
  ], []);

  // Состояние прогресса и фона
  const [progress, setProgress] = useState(0);
  const [bgStep, setBgStep] = useState(0);

  // Состояние игры
  const [isPlaying, setIsPlaying] = useState(false);
  const [CurrentGame, setCurrentGame] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Храним счетчики блокировки для каждой игры: { id: остаток_ходов }
  const [cooldowns, setCooldowns] = useState({
    //'feed': 0,
    //'balloons': 0,
    //'abc': 0,
    //'odd-one-out': 0,
    //'order-of-objects': 0,
    //'syllables': 0,
    //'puzzle': 0,
    //'simon': 0,
    'match': 0,
  });

  // Вспомогательная функция для выбора игры с учетом блокировок
  const pickRandomGame = useCallback((currentCooldowns) => {
    // Игра доступна, если её счетчик равен 0
    const availableGames = gamePool.filter(game => (currentCooldowns[game.id] || 0) === 0);
    
    // Если по какой-то причине все игры заблокированы, берем любую
    const pool = availableGames.length > 0 ? availableGames : gamePool;
    
    return pool[Math.floor(Math.random() * pool.length)];
  }, [gamePool]);

  // Функция обновления счетчиков
  const updateCooldowns = (nextGameId) => {
    setCooldowns(prev => {
      const newCooldowns = { ...prev };
      
      // 1. Уменьшаем счетчик у всех, кто уже «отдыхает»
      Object.keys(newCooldowns).forEach(id => {
        if (newCooldowns[id] > 0) {
          newCooldowns[id] -= 1;
        }
      });

      // 2. Ставим новой игре 2 (она пропустит следующие 2 хода)
      newCooldowns[nextGameId] = 2;
      
      return newCooldowns;
    });
  };

  const handleStartGame = () => {
    setIsTransitioning(true);
    setBgStep(1);

    // Сбрасываем кулдауны при новом старте
    const resetCooldowns = { 'feed': 0, 'abc': 0, 'odd-one-out': 0, 'order-of-objects': 0 };
    setCooldowns(resetCooldowns);

    setTimeout(() => {
      const firstGame = pickRandomGame(resetCooldowns);
      setCurrentGame(firstGame);
      updateCooldowns(firstGame.id);
      
      setIsPlaying(true);
      setIsTransitioning(false);
    }, 1200);
  };

  const handleGameFinish = (result) => {
    if (!result) return;

    setIsTransitioning(true);
    // Мгновенно убираем игру, чтобы избежать бага с повторным звуком
    setCurrentGame(null);

    setProgress(prev => {
      const next = prev + 1;
      setBgStep(next + 1);

      if (next >= MAX_PROGRESS) {
        // Конец серии игр
        setTimeout(() => {
          setIsPlaying(false);
          setProgress(0);
          setBgStep(0);
          setIsTransitioning(false);
        }, 2000);
      } else {
        // Переход к следующей игре
        setTimeout(() => {
          // Важно: используем актуальное состояние кулдаунов через функциональный сеттер
          // или просто выбираем игру на основе текущего состояния
          setCooldowns(currentCool => {
            const nextGame = pickRandomGame(currentCool);
            
            // Запускаем отрисовку новой игры
            setCurrentGame(nextGame);
            setIsTransitioning(false);

            // Возвращаем обновленные кулдауны
            const updated = { ...currentCool };
            Object.keys(updated).forEach(id => {
                if (updated[id] > 0) updated[id] -= 1;
            });
            updated[nextGame.id] = 2;
            return updated;
          });
        }, 1200);
      }

      return next;
    });
  };

  return (
    <div className="game-main-layout">
      <GameBackground step={bgStep} />

      {isPlaying && (
        <Header currentStep={progress} max={MAX_PROGRESS} />
      )}

      <main className="content">
        {!isPlaying ? (
          <div className={`start-screen ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
            <button className="play-button-container" onClick={handleStartGame}>
              <img src={Play} alt="Play" className="play-icon" />
            </button>
          </div>
        ) : (
          CurrentGame && (
            <div className={`game-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              <CurrentGame.Component
                key={CurrentGame.id}
                onSuccess={handleGameFinish}
              />
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Games;