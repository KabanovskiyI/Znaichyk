from django.contrib import admin
from .models import User, Profile

# 1. Робимо так, щоб Профіль відображався всередині Користувача
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Профіль користувача (Скіли)'
    fk_name = 'user'

# 2. Налаштовуємо відображення моделі User
@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    # Які колонки показувати в загальному списку
    list_display = ('email', 'is_active', 'is_staff', 'is_superuser')
    
    # Додаємо фільтри збоку
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    
    # Пошук по email
    search_fields = ('email',)
    
    # Сортування
    ordering = ('email',)
    
    # Підключаємо наш профіль сюди
    inlines = (ProfileInline, )

# 3. (Опціонально) Якщо хочеш, щоб Профіль був ще й окремою вкладкою в адмінці
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'language', 'math', 'logic', 'memory', 'completed_sessions')
    search_fields = ('user__email',)
    list_filter = ('completed_sessions',)