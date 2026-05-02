from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from .forms import *
from .models import User, Profile

def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save() # Створюємо неактивного користувача
            Profile.objects.create(user=user) # Створюємо профіль з базовими налаштуваннями (рівень 1)

            # Зберігаємо ID користувача в сесії, щоб знати, чий це тест
            request.session['registration_user_id'] = user.id

            # Редірект на сторінку тесту
            return redirect("onboarding_test")
    else:
        form = RegisterForm()
    return render(request, "Users/register.html", {"form": form})


def onboarding_test_view(request):
    # Перевіряємо, чи є ID користувача в сесії
    user_id = request.session.get('registration_user_id')
    if not user_id:
        return redirect('register') # Якщо зайшли випадково без реєстрації — на початок
    
    user = User.objects.get(id=user_id)

    if request.method == "POST":
        # Отримуємо відповіді з форми (1, 2 або 3)
        # Якщо щось пішло не так, за замовчуванням ставимо 1
        language_lvl = int(request.POST.get('language', 1))
        math_lvl = int(request.POST.get('math', 1))
        logic_lvl = int(request.POST.get('logic', 1))
        memory_lvl = int(request.POST.get('memory', 1))

        # Оновлюємо профіль
        profile = user.profile
        profile.language = language_lvl
        profile.math = math_lvl
        profile.logic = logic_lvl
        profile.memory = memory_lvl
        profile.save()

        # ТІЛЬКИ ТЕПЕР генеруємо токен і відправляємо лист
        token = default_token_generator.make_token(user)
        confirm_url = request.build_absolute_uri(
            reverse("confirm_email", args=[user.pk, token])
        )

        send_mail(
            "Підтвердження реєстрації Znaichyk",
            f"Перейдіть за посиланням для підтвердження пошти: {confirm_url}",
            settings.EMAIL_HOST_USER,
            [user.email],
        )

        # Очищаємо сесію, бо процес завершено
        del request.session['registration_user_id']

        # Показуємо сторінку "Перевірте пошту"
        return render(request, "Users/check_email.html")

    # Якщо GET-запит — показуємо тест
    return render(request, "Users/onboarding_test.html")

def confirm_email_view(request, uid, token):
    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return render(request, "Users/invalid_link.html")

    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return redirect("profile")
    return render(request, "Users/invalid_link.html")

def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST, request=request)
        if form.is_valid():
            login(request, form.user)
            return redirect("profile")
    else:
        form = LoginForm()
    return render(request, "Users/login.html", {"form": form})

def logout_view(request):
    logout(request)
    return redirect("login")

def profile_view(request):
    return render(request, "Users/profile.html")

def password_reset_request_view(request):
    success = False
    if request.method == "POST":
        form = PasswordResetRequestForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            reset_url = request.build_absolute_uri(
                reverse("password_reset_confirm", args=[user.pk, token])
            )
            send_mail(
                "Відновлення пароля Znaichyk",
                f"Для зміни пароля перейдіть за посиланням: {reset_url}",
                settings.EMAIL_HOST_USER,
                [email],
            )
            success = True
    else:
        form = PasswordResetRequestForm()
    return render(request, "Users/password_reset_request.html", {"form": form, "success": success})

def password_reset_confirm_view(request, uid, token):
    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return render(request, "Users/invalid_link.html")

    if not default_token_generator.check_token(user, token):
        return render(request, "Users/invalid_link.html")

    if request.method == "POST":
        form = SetNewPasswordForm(request.POST)
        if form.is_valid():
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect("login") # Після успіху — на логін
    else:
        form = SetNewPasswordForm()
    
    return render(request, "Users/password_reset_confirm.html", {"form": form})