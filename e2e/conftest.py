import base64
import random
import uuid
from datetime import date, timedelta

import pytest
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from config import ADMIN_EMAIL, ADMIN_PASSWORD, API_URL, BASE_URL, SCREENSHOT_DIR
from pages.login_page import LoginPage
from utils.api_client import ApiClient

CLIENT_PASSWORD = "ClientPass123!"


def pytest_addoption(parser):
    parser.addoption("--headed", action="store_true", default=False, help="Afficher la fenêtre Chrome")


@pytest.fixture(scope="session", autouse=True)
def environment_ready():
    """Échoue immédiatement avec un message clair si l'API ou le front ne répondent pas."""
    try:
        health = requests.get(f"{API_URL}/api/health", timeout=5)
        health.raise_for_status()
    except requests.RequestException as exc:
        pytest.exit(f"API injoignable sur {API_URL} : {exc}", returncode=2)
    try:
        requests.get(BASE_URL, timeout=30).raise_for_status()
    except requests.RequestException as exc:
        pytest.exit(f"Front-end injoignable sur {BASE_URL} : {exc}", returncode=2)


@pytest.fixture(scope="session")
def api():
    return ApiClient()


@pytest.fixture(scope="session")
def admin_credentials():
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        pytest.exit("Définissez E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD (voir e2e/.env.example)", returncode=2)
    return {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}


@pytest.fixture(scope="session")
def admin_token(api, admin_credentials):
    return api.login(admin_credentials["email"], admin_credentials["password"])


@pytest.fixture
def driver(request):
    options = Options()
    if not request.config.getoption("--headed"):
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,900")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    browser = webdriver.Chrome(options=options)
    browser.implicitly_wait(0)
    request.node.driver = browser
    yield browser
    browser.quit()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    browser = getattr(item, "driver", None)
    if report.when != "call" or report.passed or browser is None:
        return
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    name = item.nodeid.replace("/", "_").replace("::", "__").replace("\\", "_")
    path = SCREENSHOT_DIR / f"{name}.png"
    try:
        browser.save_screenshot(str(path))
    except Exception:
        return
    pytest_html = item.config.pluginmanager.getplugin("html")
    if pytest_html:
        extras = getattr(report, "extras", [])
        extras.append(pytest_html.extras.png(base64.b64encode(path.read_bytes()).decode()))
        extras.append(pytest_html.extras.url(browser.current_url, name="URL au moment de l'échec"))
        report.extras = extras


@pytest.fixture
def cleanup(api, admin_token):
    """Supprime les données créées par un test, dans l'ordre : réservations, clients, voitures, messages."""
    created = {"clients": [], "cars": [], "message_emails": []}
    yield created
    for client in created["clients"]:
        try:
            token = api.login(client["email"], client["password"])
            api.cancel_all_reservations(token)
        except requests.RequestException:
            pass
        user_id = api.find_user_id(admin_token, client["email"])
        if user_id:
            api.delete_user(admin_token, user_id)
    for car_id in created["cars"]:
        api.delete_car(admin_token, car_id)
    for email in created["message_emails"]:
        api.delete_messages_by_email(admin_token, email)


def _unique_email(prefix="e2e"):
    return f"{prefix}.{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture
def unique_email():
    return _unique_email


@pytest.fixture
def client_user(api, cleanup):
    email = _unique_email("client")
    api.create_user(email, CLIENT_PASSWORD, first="Selenium", last="Client")
    user = {"email": email, "password": CLIENT_PASSWORD, "first": "Selenium", "last": "Client"}
    cleanup["clients"].append(user)
    return user


@pytest.fixture
def test_car(api, admin_token, cleanup):
    car = api.create_car(admin_token)
    cleanup["cars"].append(car["_id"])
    return car


@pytest.fixture
def future_dates():
    """Période unique dans le futur lointain pour éviter les chevauchements entre exécutions."""
    start = date.today() + timedelta(days=random.randint(400, 3000))
    return start.isoformat(), (start + timedelta(days=2)).isoformat()


@pytest.fixture
def login(driver):
    def _login(email, password, expected_prefix=None):
        page = LoginPage(driver).open()
        page.login(email, password)
        page.wait.until(lambda d: page.current_path() != "/login")
        if expected_prefix:
            page.wait_for_path_startswith(expected_prefix)
        return page

    return _login


@pytest.fixture
def login_client(login, client_user):
    page = login(client_user["email"], client_user["password"])
    assert page.nav_link_visible("Mes réservations"), "La connexion client a échoué"
    return client_user


@pytest.fixture
def login_admin(login, admin_credentials):
    return login(admin_credentials["email"], admin_credentials["password"], expected_prefix="/dashboard")
