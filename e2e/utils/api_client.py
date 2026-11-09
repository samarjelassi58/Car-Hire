"""Client HTTP utilisé uniquement pour préparer et nettoyer les données de test."""
import uuid

import requests

from config import API_URL

TIMEOUT = 15


class ApiClient:
    def __init__(self):
        self.base = f"{API_URL}/api"

    def _headers(self, token=None):
        return {"Authorization": f"Bearer {token}"} if token else {}

    def health(self):
        return requests.get(f"{self.base}/health", timeout=TIMEOUT)

    def login(self, email, password):
        res = requests.post(
            f"{self.base}/auth/login",
            json={"Email": email, "Password": password},
            timeout=TIMEOUT,
        )
        res.raise_for_status()
        return res.json()["token"]

    def create_user(self, email, password, first="E2E", last="Client", phone="+216 20 000 000"):
        res = requests.post(
            f"{self.base}/user/createUser",
            json={"FirstName": first, "LastName": last, "Phone": phone, "Email": email, "Password": password},
            timeout=TIMEOUT,
        )
        res.raise_for_status()
        return res.json()

    def find_user_id(self, admin_token, email):
        res = requests.get(f"{self.base}/user", headers=self._headers(admin_token), timeout=TIMEOUT)
        res.raise_for_status()
        for user in res.json()["data"]:
            if user["Email"] == email:
                return user["_id"]
        return None

    def delete_user(self, admin_token, user_id):
        return requests.delete(f"{self.base}/user/{user_id}", headers=self._headers(admin_token), timeout=TIMEOUT)

    def create_car(self, admin_token, name=None, price=100):
        payload = {
            "name": name or f"E2E Car {uuid.uuid4().hex[:8]}",
            "pricePerDay": price,
            "fuelType": "Petrol",
            "category": "Compact",
            "tag": "e2e",
            "options": ["AC", "Bluetooth"],
        }
        res = requests.post(f"{self.base}/car/createCar", json=payload, headers=self._headers(admin_token), timeout=TIMEOUT)
        res.raise_for_status()
        return res.json()

    def delete_car(self, admin_token, car_id):
        return requests.delete(f"{self.base}/car/deleteCar/{car_id}", headers=self._headers(admin_token), timeout=TIMEOUT)

    def cancel_all_reservations(self, token):
        res = requests.get(f"{self.base}/reservation/my", headers=self._headers(token), timeout=TIMEOUT)
        if res.status_code != 200:
            return
        for item in res.json().get("data", []):
            requests.delete(f"{self.base}/reservation/{item['_id']}", headers=self._headers(token), timeout=TIMEOUT)

    def create_reservation(self, token, car_id, start, end):
        res = requests.post(
            f"{self.base}/reservation",
            json={"carId": car_id, "startDate": start, "endDate": end},
            headers=self._headers(token),
            timeout=TIMEOUT,
        )
        res.raise_for_status()
        return res.json()["data"]

    def delete_messages_by_email(self, admin_token, email):
        res = requests.get(f"{self.base}/message/getMessages", headers=self._headers(admin_token), timeout=TIMEOUT)
        if res.status_code != 200:
            return
        for msg in res.json().get("data", []):
            if msg.get("email") == email:
                requests.delete(f"{self.base}/message/{msg['_id']}", headers=self._headers(admin_token), timeout=TIMEOUT)
