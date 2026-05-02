from django.urls import path
from .views import *

urlpatterns = [
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("profile/", profile_view, name="profile"),
    path("confirm/<int:uid>/<str:token>/", confirm_email_view, name="confirm_email"),
    path('password-reset/', password_reset_request_view, name='password_reset_request'),
    path('password-reset-confirm/<int:uid>/<str:token>/', password_reset_confirm_view, name='password_reset_confirm'),
    path('onboarding/', onboarding_test_view, name='onboarding_test'),
]