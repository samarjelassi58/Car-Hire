from selenium.webdriver.common.by import By

from .base_page import BasePage


class LoginPage(BasePage):
    path = "/login"

    SUBMIT = (By.CSS_SELECTOR, "form button[type='submit']")
    TOGGLE = (By.CSS_SELECTOR, "form button[type='button']")
    HEADING = (By.TAG_NAME, "h2")

    def heading(self):
        return self.find(self.HEADING).text

    def login(self, email, password):
        self.type(self.by_name("Email"), email)
        self.type(self.by_name("Password"), password)
        self.click(self.SUBMIT)
        return self

    def switch_to_signup(self):
        self.click(self.TOGGLE)
        self.wait.until(lambda d: self.heading() == "Inscription")
        return self

    def sign_up(self, first, last, email, phone, password):
        self.type(self.by_name("FirstName"), first)
        self.type(self.by_name("LastName"), last)
        self.type(self.by_name("Email"), email)
        self.type(self.by_name("Phone"), phone)
        self.type(self.by_name("Password"), password)
        self.click(self.SUBMIT)
        return self

    def password_min_length(self):
        return self.find(self.by_name("Password")).get_attribute("minlength")
