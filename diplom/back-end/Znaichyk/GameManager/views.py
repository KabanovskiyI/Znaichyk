import logging
from django.http import JsonResponse
# Переконайся, що шлях імпорту правильний (залежить від твоєї структури папок)
from .services.GameConfigManager import GameSequenceManager 

logger = logging.getLogger(__name__)

def get_game_sequence(request):
    # Отримуємо сесії. Якщо порожньо — ставимо 0
    completed_sessions = request.session.get('completed_sessions', 0)

    # Початковий конфіг (заглушка)
    mock_user_skills = {
        "language": 3,
        "math": 3,
        "logic": 3,
        "memory": 3
    }

    manager = GameSequenceManager(completed_sessions, mock_user_skills)
    sequence = manager.generate_sequence()

    logger.info(f"Сесій: {completed_sessions}. Рівень: {manager.current_global_lvl}")

    return JsonResponse({
        "current_global_lvl": manager.current_global_lvl,
        "completed_sessions_in_db": completed_sessions,
        "sequence": sequence
    })

def complete_game_session(request):
    """Ендпоінт для інкременту сесій"""
    current = request.session.get('completed_sessions', 0)
    request.session['completed_sessions'] = current + 1
    return JsonResponse({"status": "success", "new_total": current + 1})