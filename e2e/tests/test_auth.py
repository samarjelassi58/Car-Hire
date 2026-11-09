import pytest

from pages.base_page import BasePage
from pages.login_page import LoginPage

pytestmark = pytest.mark.auth


@pytest.mark.smoke
def test_login_page_displays_sign_in_form(driver):
    page = LoginPage(driver).open()
    assert page.heading() == "Connexion"


def test_client_can_log_in_and_sees_client_navigation(driver, client_user, login):
    page = login(client_user["email"], client_user["password"])
    assert page.nav_link_visible("Mes réservations")
    assert not page.nav_link_visible("Tableau de bord", timeout=1)


def test_admin_is_redirected_to_dashboard(driver, login_admin):
    BasePage(driver).wait_for_path("/dashboard")
    assert BasePage(driver).text_visible("Espace d'administration")


def test_invalid_credentials_show_an_error(driver, client_user):
    page = LoginPage(driver).open()
    page.login(client_user["email"], "wrong-password-123")
    assert page.alert_text("alert")
    assert page.current_path() == "/login"


def test_signup_creates_a_client_account(driver, unique_email, cleanup, api):
    email = unique_email("signup")
    password = "SignupPass123!"
    cleanup["clients"].append({"email": email, "password": password})

    page = LoginPage(driver).open().switch_to_signup()
    page.sign_up("Selenium", "Signup", email, "+216 20 111 222", password)

    assert page.alert_text("status")
    assert api.login(email, password)


def test_signup_requires_a_password_of_8_characters(driver):
    page = LoginPage(driver).open().switch_to_signup()
    assert page.password_min_length() == "8"


def test_signup_rejects_duplicate_email(driver, client_user):
    page = LoginPage(driver).open().switch_to_signup()
    page.sign_up("Dup", "Client", client_user["email"], "+216 20 333 444", "AnotherPass123!")
    assert page.alert_text("alert")


def test_logout_returns_to_anonymous_navigation(driver, login_client):
    page = BasePage(driver)
    page.logout()
    assert page.nav_link_visible("Connexion")
    assert not page.nav_link_visible("Mes réservations", timeout=1)


@pytest.mark.smoke
@pytest.mark.parametrize("path", ["/my-reservations", "/reservation", "/dashboard", "/admin/cars"])
def test_anonymous_user_is_redirected_to_login(driver, path):
    page = BasePage(driver).open(path)
    page.wait_for_path("/login")


def test_login_redirects_back_to_requested_page(driver, client_user):
    BasePage(driver).open("/my-reservations").wait_for_path("/login")
    LoginPage(driver).login(client_user["email"], client_user["password"])
    BasePage(driver).wait_for_path("/my-reservations")


@pytest.mark.parametrize("path", ["/dashboard", "/admin/clients", "/admin/cars", "/admin/messages", "/admin/reservations"])
def test_client_cannot_access_admin_pages(driver, login_client, path):
    page = BasePage(driver).open(path)
    page.wait_for_path("/notfound")


def test_unknown_route_displays_404(driver):
    page = BasePage(driver).open("/this-page-does-not-exist")
    assert page.text_visible("Page non trouvée")
