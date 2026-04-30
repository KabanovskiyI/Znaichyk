from django.urls import path
from .views import get_game_sequence, complete_game_session

urlpatterns = [
    path('config/', get_game_sequence, name='game_config'),
    path('complete/', complete_game_session, name='game_config'),
]