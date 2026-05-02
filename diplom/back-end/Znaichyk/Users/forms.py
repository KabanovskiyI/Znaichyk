from django import forms
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label="Пароль")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Повторіть пароль")

    class Meta:
        model = User
        fields = ['email']

    def clean(self):
        cleaned = super().clean()
        if cleaned.get('password') != cleaned.get('password2'):
            raise forms.ValidationError("Паролі не співпадають")
        return cleaned

    def save(self, commit=True):
        user = User(email=self.cleaned_data['email'])
        user.set_password(self.cleaned_data['password'])
        user.is_active = False # Чекаємо активації
        if commit: user.save()
        return user

class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        self.user = None
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        password = cleaned_data.get("password")
        user = authenticate(self.request, username=email, password=password)
        if user is None:
            raise forms.ValidationError("Невірна пошта або пароль")
        self.user = user
        return cleaned_data
    
class PasswordResetRequestForm(forms.Form):
    email = forms.EmailField(label="Ваш Email")

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not User.objects.filter(email=email).exists():
            raise forms.ValidationError("Користувача з такою поштою не знайдено")
        return email

class SetNewPasswordForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput, label="Новий пароль")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Повторіть пароль")

    def clean(self):
        cleaned = super().clean()
        if cleaned.get('password') != cleaned.get('password2'):
            raise forms.ValidationError("Паролі не співпадають")
        return cleaned