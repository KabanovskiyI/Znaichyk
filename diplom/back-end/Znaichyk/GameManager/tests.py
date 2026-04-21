import json
from django.test import TestCase, Client
from django.urls import reverse

class GameApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('game_config') 

    def test_get_game_config_json(self):
        response = self.client.get(self.url)

        # Перевіряємо, що сервер відповів успішно (200 OK)
        self.assertEqual(response.status_code, 200)

        # Декодуємо JSON
        data = response.json()

        # Виводимо JSON у консоль для перевірки (під час виконання тесту)
        print("\n--- Сформований JSON для фронтенду ---")
        print(json.dumps(data, indent=4))
        print("--------------------------------------")

        # Перевіряємо наявність основних тем у відповіді
        self.assertIn('math', data)
        self.assertIn('language', data)
        self.assertIn('logic', data)
        self.assertIn('memory', data)
