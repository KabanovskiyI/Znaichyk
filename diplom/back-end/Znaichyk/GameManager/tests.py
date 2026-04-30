from django.test import TestCase
from .services.GameConfigManager import GameSequenceManager

class GameProgressionTest(TestCase):
    def setUp(self):
        print("\n" + "="*50)
        print("ЗАПУСК ТЕСТУВАННЯ ЛОГІКИ ГЕЙМ-МЕНЕДЖЕРА")
        print("="*50)

    def test_progression_logic_verbose(self):
        """Тестування зміни рівнів та складу ігор при різній кількості сесій."""
        
        test_cases = [
            {"sessions": 0, "expected_lvl": 1, "desc": "Початківець (0 сесій)"},
            {"sessions": 4, "expected_lvl": 1, "desc": "Початківець (перед підвищенням)"},
            {"sessions": 5, "expected_lvl": 2, "desc": "Середній (рівно 5 сесій)"},
            {"sessions": 9, "expected_lvl": 2, "desc": "Середній (перед переходом на макс)"},
            {"sessions": 10, "expected_lvl": 3, "desc": "Просунутий (10+ сесій)"},
            {"sessions": 25, "expected_lvl": 3, "desc": "Просунутий (багато ігор)"},
        ]

        for case in test_cases:
            manager = GameSequenceManager(case["sessions"])
            sequence = manager.generate_sequence(5)
            pool = manager.get_weighted_pool()
            
            # Логування результатів для кожного кейсу
            print(f"\n[ТЕСТ]: {case['desc']}")
            print(f"  -> Розрахований рівень: {manager.current_global_lvl}")
            print(f"  -> Доступно ігор у пулі: {len(pool)}")
            
            unique_lvls = sorted(list(set(g['lvl'] for g in pool)))
            print(f"  -> Рівні ігор у пулі: {unique_lvls}")
            
            seq_ids = [g['id'] for g in sequence]
            print(f"  -> Згенерована черга: {seq_ids}")

            # Перевірки (Assertions)
            self.assertEqual(manager.current_global_lvl, case["expected_lvl"])
            self.assertEqual(len(sequence), 5)
            
            # Перевірка, що ігри відповідають дозволеним рівням
            for game in sequence:
                game_lvl = int(game['lvl_key'].split('_')[1])
                if manager.current_global_lvl == 1:
                    self.assertEqual(game_lvl, 1)
                elif manager.current_global_lvl == 2:
                    self.assertIn(game_lvl, [1, 2])
                elif manager.current_global_lvl == 3:
                    self.assertIn(game_lvl, [2, 3])

    def test_repetition_prevention(self):
        """Перевірка, що ігри не дублюються одна за одною."""
        print("\n[ТЕСТ]: Перевірка на відсутність повторів підряд")
        manager = GameSequenceManager(10)
        sequence = manager.generate_sequence(10) # Довша черга для перевірки
        
        seq_ids = [g['id'] for g in sequence]
        print(f"  -> Довга черга: {seq_ids}")
        
        for i in range(1, len(seq_ids)):
            self.assertNotEqual(seq_ids[i], seq_ids[i-1], f"Дублювання гри {seq_ids[i]} на кроці {i}")
        print("  -> Ок: Жодних повторів підряд не виявлено.")

    def tearDown(self):
        print("\n" + "="*50)