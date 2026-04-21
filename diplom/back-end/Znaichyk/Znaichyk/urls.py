from django.contrib import admin
from django.urls import path, include
from GameManager import urls
urlpatterns = [
    path('admin/', admin.site.urls),
    path('game/', include('GameManager.urls')),
]
