from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from config import BASE_URL, DEFAULT_TIMEOUT

IGNORED = (NoSuchElementException, StaleElementReferenceException)

SET_VALUE_JS = """
const el = arguments[0];
const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, arguments[1]);
el.dispatchEvent(new Event('input', { bubbles: true }));
el.dispatchEvent(new Event('change', { bubbles: true }));
"""


class BasePage:
    path = "/"

    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, DEFAULT_TIMEOUT, ignored_exceptions=IGNORED)

    def open(self, path=None):
        self.driver.get(f"{BASE_URL}{path or self.path}")
        return self

    def by_name(self, name):
        return (By.NAME, name)

    def find(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def click(self, locator):
        self.wait.until(EC.element_to_be_clickable(locator)).click()

    def type(self, locator, text):
        field = self.find(locator)
        field.clear()
        field.send_keys(text)

    def set_value(self, locator, value):
        """Renseigne un champ contrôlé par React (ex. input type=date)."""
        self.driver.execute_script(SET_VALUE_JS, self.find(locator), value)

    def is_visible(self, locator, timeout=3):
        try:
            WebDriverWait(self.driver, timeout, ignored_exceptions=IGNORED).until(EC.visibility_of_element_located(locator))
            return True
        except TimeoutException:
            return False

    def any_visible(self, locator, timeout=DEFAULT_TIMEOUT):
        """Vrai si au moins un des éléments correspondants est affiché (navbar desktop/mobile)."""
        def displayed(driver):
            for element in driver.find_elements(*locator):
                try:
                    if element.is_displayed():
                        return True
                except StaleElementReferenceException:
                    continue
            return False

        try:
            WebDriverWait(self.driver, timeout).until(displayed)
            return True
        except TimeoutException:
            return False

    def nav_link_visible(self, label, timeout=DEFAULT_TIMEOUT):
        return self.any_visible((By.XPATH, f"//nav//a[normalize-space()='{label}']"), timeout)

    def text_visible(self, text, timeout=DEFAULT_TIMEOUT):
        return self.any_visible((By.XPATH, f"//*[not(*)][contains(normalize-space(.), {self._xpath_literal(text)})]"), timeout)

    def alert_text(self, role="alert", timeout=DEFAULT_TIMEOUT):
        locator = (By.XPATH, f"//*[@role='{role}']")
        return self.wait_for(locator, timeout).text

    def wait_for(self, locator, timeout=DEFAULT_TIMEOUT):
        return WebDriverWait(self.driver, timeout, ignored_exceptions=IGNORED).until(EC.visibility_of_element_located(locator))

    def accept_confirm(self):
        WebDriverWait(self.driver, DEFAULT_TIMEOUT).until(EC.alert_is_present())
        self.driver.switch_to.alert.accept()

    def wait_for_path(self, path, timeout=DEFAULT_TIMEOUT):
        WebDriverWait(self.driver, timeout).until(lambda d: self.current_path().rstrip("/") == path.rstrip("/"))

    def wait_for_path_startswith(self, prefix, timeout=DEFAULT_TIMEOUT):
        WebDriverWait(self.driver, timeout).until(lambda d: self.current_path().startswith(prefix))

    def current_path(self):
        return self.driver.execute_script("return window.location.pathname")

    def row_with_text(self, text, tag="tr"):
        return (By.XPATH, f"//{tag}[contains(., {self._xpath_literal(text)})]")

    def logout(self):
        """Clique sur le bouton de déconnexion visible."""
        def visible_logout(driver):
            for btn in driver.find_elements(By.XPATH, "//button[normalize-space()='Déconnexion']"):
                if btn.is_displayed():
                    return btn
            return False

        self.wait.until(visible_logout).click()

    @staticmethod
    def _xpath_literal(value):
        if "'" not in value:
            return f"'{value}'"
        return "concat('" + value.replace("'", "',\"'\",'") + "')"
