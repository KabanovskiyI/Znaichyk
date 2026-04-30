import random

class GameSequenceManager:
    def __init__(self, completed_sessions, user_skills):
        self.completed_sessions = completed_sessions
        self.user_skills = user_skills
        
        # Бонус прогресії: 0-4 сесії = 0, 5-9 = 1, і т.д.
        self.progression_bonus = self.completed_sessions // 5
        
        # Розраховуємо середній глобальний рівень для фронта (середнє по скілах + бонус)
        base_avg = sum(self.user_skills.values()) / len(self.user_skills)
        self.current_global_lvl = min(3, int(base_avg + self.progression_bonus))
        
        self.topics = ['language', 'math', 'logic', 'memory']
        self.all_games = self._build_game_registry()

    def _build_game_registry(self):
        games = []
        for topic in self.topics:
            start_lvl = self.user_skills.get(topic, 1)
            # Рівень конкретного топіку
            topic_lvl = min(3, start_lvl + self.progression_bonus)
            
            for lvl in [1, 2, 3]:
                games.append({
                    "id": f"{topic}_lvl_{lvl}",
                    "topic": topic,
                    "lvl": lvl,
                    "is_active": self._is_lvl_allowed(lvl, topic_lvl),
                    "is_priority": (lvl == topic_lvl)
                })
        return games

    def _is_lvl_allowed(self, lvl, topic_lvl):
        if topic_lvl == 1: return lvl == 1
        if topic_lvl == 2: return lvl in [1, 2]
        if topic_lvl == 3: return lvl in [2, 3]
        return False

    def get_weighted_pool(self):
        pool = []
        for game in self.all_games:
            if game["is_active"]:
                pool.append(game)
                # Подвійна вага для ігор поточного рівня
                if game["is_priority"]:
                    pool.append(game)
        return pool

    def generate_sequence(self, count=5):
        pool = self.get_weighted_pool()
        if not pool: return []
        
        sequence = []
        for i in range(count):
            last_id = sequence[i-1]["id"] if i > 0 else None
            prev_id = sequence[i-2]["id"] if i > 1 else None
            
            # Фільтруємо, щоб одна гра не йшла двічі підряд
            options = [g for g in pool if g["id"] not in (last_id, prev_id)]
            source = options if options else pool
            pick = random.choice(source)
            
            sequence.append({
                "id": pick["id"],
                "topic": pick["topic"],
                "lvl_key": f"lvl_{pick['lvl']}"
            })
        return sequence