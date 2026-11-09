import pytest

from pages.cars_page import CarsPage
from pages.reservation_page import MyReservationsPage, ReservationPage

pytestmark = pytest.mark.reservation


@pytest.mark.smoke
def test_client_books_a_car_and_sees_it_in_my_reservations(driver, login_client, test_car, future_dates):
    start, end = future_dates
    page = ReservationPage(driver).open()
    page.select_car(test_car["name"]).fill_dates(start, end).submit()

    page.wait_for_path("/my-reservations")
    mine = MyReservationsPage(driver)
    assert mine.has_reservation(test_car["name"])
    assert mine.status_of(test_car["name"]) == "En attente"


def test_reserve_button_on_card_preselects_the_car(driver, login_client, test_car):
    CarsPage(driver).open().reserve(test_car["name"])
    assert test_car["name"] in ReservationPage(driver).selected_car_text()


def test_summary_shows_total_price(driver, login_client, test_car, future_dates):
    start, end = future_dates
    page = ReservationPage(driver).open()
    page.select_car(test_car["name"]).fill_dates(start, end)
    assert page.text_visible(f"{test_car['pricePerDay'] * 2} TND") or page.text_visible(f"{test_car['pricePerDay'] * 3} TND")


def test_overlapping_booking_is_rejected(driver, api, client_user, login, test_car, future_dates, cleanup):
    start, end = future_dates
    other = {"email": f"other.{client_user['email']}", "password": client_user["password"]}
    api.create_user(other["email"], other["password"], first="Other", last="Client")
    cleanup["clients"].append(other)
    api.create_reservation(api.login(other["email"], other["password"]), test_car["_id"], start, end)

    login(client_user["email"], client_user["password"])
    page = ReservationPage(driver).open()
    page.select_car(test_car["name"]).fill_dates(start, end).submit()
    assert page.error()
    assert page.current_path() == "/reservation"


def test_end_date_before_start_date_is_rejected(driver, login_client, test_car, future_dates):
    start, end = future_dates
    page = ReservationPage(driver).open()
    page.select_car(test_car["name"]).fill_dates(end, start).submit()
    assert page.current_path() == "/reservation"


def test_client_cancels_own_reservation(driver, api, client_user, login, test_car, future_dates):
    start, end = future_dates
    token = api.login(client_user["email"], client_user["password"])
    api.create_reservation(token, test_car["_id"], start, end)

    login(client_user["email"], client_user["password"])
    mine = MyReservationsPage(driver).open()
    assert mine.has_reservation(test_car["name"])
    mine.cancel(test_car["name"])
    assert mine.wait.until(lambda d: mine.status_of(test_car["name"]) == "Annulée")


def test_my_reservations_is_empty_for_a_new_client(driver, login_client):
    mine = MyReservationsPage(driver).open()
    assert mine.text_visible("Mes réservations")
    assert not mine.is_visible(mine.item("E2E Car"), timeout=1)
