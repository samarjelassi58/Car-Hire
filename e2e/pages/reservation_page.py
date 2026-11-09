from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from .base_page import BasePage


class ReservationPage(BasePage):
    path = "/reservation"

    CAR = (By.ID, "carId")
    START = (By.ID, "startDate")
    END = (By.ID, "endDate")
    SUBMIT = (By.XPATH, "//form//button[@type='submit']")

    def select_car(self, name):
        select = Select(self.find(self.CAR))
        option = next(o for o in select.options if name in o.text)
        select.select_by_value(option.get_attribute("value"))
        return self

    def selected_car_text(self):
        select = Select(self.find(self.CAR))
        return select.first_selected_option.text

    def fill_dates(self, start, end):
        self.set_value(self.START, start)
        self.set_value(self.END, end)
        return self

    def submit(self):
        self.click(self.SUBMIT)
        return self

    def error(self):
        return self.alert_text("alert")


class MyReservationsPage(BasePage):
    path = "/my-reservations"

    def item(self, car_name):
        return (By.XPATH, f"//li[contains(., '{car_name}')]")

    def has_reservation(self, car_name):
        return self.is_visible(self.item(car_name), timeout=10)

    def status_of(self, car_name):
        badge = self.find(self.item(car_name)).find_element(By.XPATH, ".//span[contains(@class,'rounded-full')]")
        return badge.text

    def cancel(self, car_name):
        self.find(self.item(car_name)).find_element(By.XPATH, ".//button[contains(.,'Annuler')]").click()
        self.accept_confirm()
