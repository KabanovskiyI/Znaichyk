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
import Bubble from '../components/games/level_3/bubble.jsx';
import Pipes from '../components/games/level_3/pipes.jsx';
import Balance from '../components/games/level_3/mathBalanceGame.jsx';

// Кількість ігор тепер автоматично дорівнює довжині списку
const Games = () => {
  const gamePool = useMemo(() => [
    { id: 'balloons', Component: Bubble },
    { id: 'syllables', Component: Match },
    { id: 'puzzle', Component: Balance },
    { id: 'simon', Component: Pipes },

  ], []);

  const MAX_PROGRESS = gamePool.length;

  // Стан прогресу та фону
  const [progress, setProgress] = useState(0);
  const [bgStep, setBgStep] = useState(0);

  // Стан гри
  const [isPlaying, setIsPlaying] = useState(false);
  const [CurrentGame, setCurrentGame] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Логіка старту гри
  const handleStartGame = () => {
    setIsTransitioning(true);
    setBgStep(1);

    setTimeout(() => {
      // Беремо найпершу гру зі списку (індекс 0)
      setCurrentGame(gamePool[0]);
      setIsPlaying(true);
      setIsTransitioning(false);
    }, 1200);
  };

  // Логіка завершення поточної гри
  const handleGameFinish = (result) => {
    if (!result) return;

    setIsTransitioning(true);
    // Прибираємо поточну гру перед переходом
    setCurrentGame(null);

    setProgress(prev => {
      const nextProgress = prev + 1;
      setBgStep(nextProgress + 1);

      if (nextProgress >= MAX_PROGRESS) {
        // Якщо це була остання гра в списку
        setTimeout(() => {
          setIsPlaying(false);
          setProgress(0);
          setBgStep(0);
          setIsTransitioning(false);
        }, 2000);
      } else {
        // Перехід до наступної гри за порядком (індекс = nextProgress)
        setTimeout(() => {
          setCurrentGame(gamePool[nextProgress]);
          setIsTransitioning(false);
        }, 1200);
      }

      return nextProgress;
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