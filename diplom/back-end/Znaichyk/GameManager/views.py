from django.http import JsonResponse
from .services.GameConfigManager import GameConfigManager

def get_game_config(request):
    mock_test_results = {
        "language": "beginner",
        "math": "beginner",
        "logic": "beginner",
        "memory": "beginner"
    }

    manager = GameConfigManager(mock_test_results)
    config = manager.generate_config()

    return JsonResponse(config)