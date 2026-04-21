class GameConfigManager:
    def __init__(self, test_results):
        self.results = test_results

    def get_levels_for_topic(self, topic_skill):
        if topic_skill == 'beginner':
            return {"lvl_1": True, "lvl_2": False, "lvl_3": False}
        
        elif topic_skill == 'intermediate':
            return {"lvl_1": False, "lvl_2": True, "lvl_3": True}
        
        elif topic_skill == 'advanced':
            return {"lvl_1": False, "lvl_2": False, "lvl_3": True}

        return {"lvl_1": True, "lvl_2": False, "lvl_3": False}

    def generate_config(self):
        return {
            "language": self.get_levels_for_topic(self.results.get('language')),
            "math": self.get_levels_for_topic(self.results.get('math')),
            "logic": self.get_levels_for_topic(self.results.get('logic')),
            "memory": self.get_levels_for_topic(self.results.get('memory')),
        }