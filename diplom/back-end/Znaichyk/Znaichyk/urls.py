from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render

# Функція для рендеру React-додатка
def play_index(request):
    return render(request, 'index.html')

# Функція для рендеру лендінгу
def lending(request):
    return render(request, 'lending.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 1. Чистий URL тепер веде на лендінг
    path('', lending, name='lending'),
    
    # 2. Основні маршрути додатків
    path('game/', include('GameManager.urls')),
    path('users/', include('Users.urls')),
    
    # 3. Точка входу в гру (React)
    path('play/', play_index, name='play_index'),
    
    # 4. Catch-all ТІЛЬКИ для гри
    # Це дозволить React-роутингу працювати всередині /play/
    # Наприклад, /play/level-1 або /play/settings
    re_path(r'^play/.*$', play_index),
]