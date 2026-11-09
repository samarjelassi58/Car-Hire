from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from .base_page import BasePage


class AdminCarsPage(BasePage):
    path = "/admin/cars"

    TOGGLE_FORM = (By.XPATH, "//button[normalize-space()='Add a Car' or normalize-space()='Close']")
    SUBMIT = (By.XPATH, "//form//button[@type='submit']")

    def add_car(self, name, price, fuel="Petrol", category="SUV", tag="e2e", options="AC, GPS"):
        self.click((By.XPATH, "//button[normalize-space()='Add a Car']"))
        self.type(self.by_name("name"), name)
        self.type(self.by_name("pricePerDay"), str(price))
        self.type(self.by_name("fuelType"), fuel)
        self.type(self.by_name("category"), category)
        self.type(self.by_name("tag"), tag)
        self.type(self.by_name("options"), options)
        self.click(self.SUBMIT)

    def edit_car(self, name, new_price):
        self.click((By.XPATH, f"//tr[contains(., '{name}')]//button[normalize-space()='Edit']"))
        self.type(self.by_name("pricePerDay"), str(new_price))
        self.click(self.SUBMIT)

    def delete_car(self, name):
        self.click((By.XPATH, f"//tr[contains(., '{name}')]//button[normalize-space()='Delete']"))
        self.accept_confirm()

    def has_car(self, name, timeout=10):
        return self.is_visible(self.row_with_text(name), timeout)

    def row_text(self, name):
        return self.find(self.row_with_text(name)).text


class AdminReservationsPage(BasePage):
    path = "/admin/reservations"

    def has_row(self, text, timeout=10):
        return self.is_visible(self.row_with_text(text), timeout)

    def row_text(self, text):
        return self.find(self.row_with_text(text)).text

    def confirm(self, text):
        self.click((By.XPATH, f"//tr[contains(., '{text}')]//button[normalize-space()='Confirmer']"))

    def cancel(self, text):
        self.click((By.XPATH, f"//tr[contains(., '{text}')]//button[normalize-space()='Annuler']"))

    def filter_by(self, label):
        Select(self.find((By.TAG_NAME, "select"))).select_by_visible_text(label)


class AdminClientsPage(BasePage):
    path = "/admin/clients"

    def add_client(self, first, last, phone, email, password):
        self.click((By.XPATH, "//button[normalize-space()='Ajouter un client']"))
        self.type(self.by_name("FirstName"), first)
        self.type(self.by_name("LastName"), last)
        self.type(self.by_name("Phone"), phone)
        self.type(self.by_name("Email"), email)
        self.type(self.by_name("Password"), password)
        self.click((By.XPATH, "//form//button[@type='submit']"))

    def edit_phone(self, email, new_phone):
        self.click((By.XPATH, f"//tr[contains(., '{email}')]//button[normalize-space()='Modifier']"))
        self.type(self.by_name("Phone"), new_phone)
        self.click((By.XPATH, "//form//button[@type='submit']"))

    def delete_client(self, email):
        self.click((By.XPATH, f"//tr[contains(., '{email}')]//button[normalize-space()='Supprimer']"))
        self.accept_confirm()

    def has_client(self, email, timeout=10):
        return self.is_visible(self.row_with_text(email), timeout)

    def row_text(self, email):
        return self.find(self.row_with_text(email)).text


class AdminMessagesPage(BasePage):
    path = "/admin/messages"

    def article(self, text):
        return (By.XPATH, f"//article[contains(., '{text}')]")

    def has_message(self, text, timeout=10):
        return self.is_visible(self.article(text), timeout)

    def click_action(self, text, label):
        self.click((By.XPATH, f"//article[contains(., '{text}')]//button[normalize-space()='{label}']"))

    def status_text(self, text):
        return self.find(self.article(text)).text

    def delete(self, text):
        self.click_action(text, "Supprimer")
        self.accept_confirm()


class ContactPage(BasePage):
    path = "/contact"

    def send(self, first, last, email, phone, subject, message):
        self.type(self.by_name("firstName"), first)
        self.type(self.by_name("lastName"), last)
        self.type(self.by_name("email"), email)
        self.type(self.by_name("phoneNumber"), phone)
        self.type(self.by_name("messageObject"), subject)
        self.type(self.by_name("message"), message)
        self.click((By.XPATH, "//form//button[@type='submit']"))

    def success_text(self):
        return self.alert_text("status")
