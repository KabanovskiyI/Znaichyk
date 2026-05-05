import os
import sys

# Повний шлях до папки, де лежить manage.py
path = '/home/diplomznaichyk/Znaichyk/diplom/back-end/Znaichyk'
if path not in sys.path:
    sys.path.append(path)

# Вказуємо шлях до settings.py
# Примітка: 'znaichyk' — це назва папки всередині, де лежить settings.py
os.environ['DJANGO_SETTINGS_MODULE'] = 'znaichyk.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()