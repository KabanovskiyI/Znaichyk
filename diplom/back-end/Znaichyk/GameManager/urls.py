from django.urls import path
from .views import get_game_config

urlpatterns = [
    path('/config/', get_game_config, name='game_config'),
]