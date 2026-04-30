import { calculateGlobalLvl, getWeightedPool, generateSequence } from '../gameUtils';
import { describe, test, expect } from 'vitest';
describe('Game Logistics Utils', () => {
  
  test('calculateGlobalLvl: правильно підвищує рівень кожні 5 сесій', () => {
    expect(calculateGlobalLvl(0)).toBe(1);
    expect(calculateGlobalLvl(4)).toBe(1);
    expect(calculateGlobalLvl(5)).toBe(2);
    expect(calculateGlobalLvl(10)).toBe(3);
  });

  test('getWeightedPool: ігри lvl_2 мають бути представлені двічі', () => {
    const mockGames = [
      { id: 'game_lvl_1' },
      { id: 'game_lvl_2' }
    ];
    
    // На 2 рівні гра 1-го рівня входить 1 раз, а 2-го — 2 рази. Разом 3 елементи.
    const pool = getWeightedPool(mockGames, 2);
    
    expect(pool.length).toBe(3);
    const lvl2Count = pool.filter(g => g.id === 'game_lvl_2').length;
    expect(lvl2Count).toBe(2);
  });

    test('Ймовірнісний тест: lvl_2 випадає частіше ніж lvl_1', () => {
    // Даємо більше ігор, щоб правило "не повторювати 2 останні" 
    // не заважало працювати вагам
    const mockAvailable = [
        { id: 'easy_1_lvl_1' },
        { id: 'easy_2_lvl_1' },
        { id: 'hard_1_lvl_2' },
        { id: 'hard_2_lvl_2' },
    ];

    const pool = getWeightedPool(mockAvailable, 2);

    // Генеруємо велику послідовність
    const largeSeq = generateSequence(pool, 2000);
    
    const lvl1Count = largeSeq.filter(g => g.id.includes('lvl_1')).length;
    const lvl2Count = largeSeq.filter(g => g.id.includes('lvl_2')).length;

    const ratio = lvl2Count / lvl1Count;
    
    console.log(`Статистика: lvl1=${lvl1Count}, lvl2=${lvl2Count}, ratio=${ratio.toFixed(2)}`);

    // Тепер співвідношення має бути дуже близьким до 2.0
    expect(lvl2Count).toBeGreaterThan(lvl1Count);
    expect(ratio).toBeCloseTo(2, 0.3); // Допуск 0.3 на рандом
    });
});