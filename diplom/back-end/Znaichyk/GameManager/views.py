from django.http import JsonResponse
from .services.GameConfigManager import GameSequenceManager 
from django.contrib.auth.decorators import login_required
from Users.models import Profile

@login_required
def get_game_sequence(request):
    profile = request.user.profile

    mock_user_skills = {
        "language": profile.language,
        "math": profile.math,
        "logic": profile.logic,
        "memory": profile.memory
    }

    manager = GameSequenceManager(profile.completed_sessions, mock_user_skills)
    sequence = manager.generate_sequence()

    return JsonResponse({
        "current_global_lvl": manager.current_global_lvl,
        "completed_sessions_in_db": profile.completed_sessions,
        "sequence": sequence
    })

@login_required
def complete_game_session(request):
    profile = request.user.profile
    profile.completed_sessions += 1
    profile.save()
    return JsonResponse({"status": "success", "new_total": profile.completed_sessions})