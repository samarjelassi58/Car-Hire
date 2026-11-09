from selenium.webdriver.common.by import By

from .base_page import BasePage


class CarsPage(BasePage):
    path = "/cars"

    def card(self, name):
        return (By.XPATH, f"//div[.//h5[normalize-space()='{name}']][contains(@class,'cursor-pointer')]")

    def has_car(self, name):
        return self.is_visible(self.card(name), timeout=10)

    def open_car(self, name):
        self.click(self.card(name))
        self.wait_for_path_startswith("/car/")

    def reserve(self, name):
        self.click((By.XPATH, f"{self.card(name)[1]}//button[contains(.,'Réserver')]"))
        self.wait_for_path_startswith("/reservation")


class CarDetailPage(BasePage):
    TITLE = (By.TAG_NAME, "h1")
    RESERVE = (By.XPATH, "//button[contains(.,'Réserver maintenant')]")

    def title(self):
        return self.find(self.TITLE).text

    def reserve(self):
        self.click(self.RESERVE)
        self.wait_for_path_startswith("/reservation")
