import pytest

from pages.base_page import BasePage
from pages.cars_page import CarDetailPage, CarsPage

pytestmark = pytest.mark.cars


@pytest.mark.smoke
def test_cars_page_lists_a_car_created_through_the_api(driver, test_car):
    page = CarsPage(driver).open()
    assert page.has_car(test_car["name"])


def test_car_card_displays_price_and_options(driver, test_car):
    page = CarsPage(driver).open()
    assert page.has_car(test_car["name"])
    card_text = page.find(page.card(test_car["name"])).text
    assert f"{test_car['pricePerDay']} TND/jour" in card_text
    assert "AC" in card_text


def test_clicking_a_card_opens_the_car_detail(driver, test_car):
    page = CarsPage(driver).open()
    page.open_car(test_car["name"])
    assert CarDetailPage(driver).title() == test_car["name"]


def test_detail_page_loads_directly_by_url(driver, test_car):
    BasePage(driver).open(f"/car/{test_car['_id']}")
    assert CarDetailPage(driver).title() == test_car["name"]


def test_reserve_button_requires_login(driver, test_car):
    BasePage(driver).open(f"/car/{test_car['_id']}")
    detail = CarDetailPage(driver)
    detail.title()
    detail.click(detail.RESERVE)
    detail.wait_for_path("/login")
