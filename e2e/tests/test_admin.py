import uuid

import pytest

from pages.admin_pages import (
    AdminCarsPage,
    AdminClientsPage,
    AdminMessagesPage,
    AdminReservationsPage,
    ContactPage,
)

pytestmark = pytest.mark.admin


@pytest.mark.smoke
def test_admin_creates_edits_and_deletes_a_car(driver, login_admin, api, admin_token, cleanup):
    name = f"E2E Admin Car {uuid.uuid4().hex[:6]}"
    page = AdminCarsPage(driver).open()

    page.add_car(name, 150)
    assert page.has_car(name)
    assert "150" in page.row_text(name)

    page.edit_car(name, 175)
    page.wait.until(lambda d: "175" in page.row_text(name))

    page.delete_car(name)
    page.wait.until(lambda d: not page.is_visible(page.row_with_text(name), timeout=1))


def test_admin_confirms_a_client_reservation(driver, api, client_user, test_car, future_dates, login_admin):
    start, end = future_dates
    api.create_reservation(api.login(client_user["email"], client_user["password"]), test_car["_id"], start, end)

    page = AdminReservationsPage(driver).open()
    assert page.has_row(test_car["name"])
    assert "En attente" in page.row_text(test_car["name"])

    page.confirm(test_car["name"])
    page.wait.until(lambda d: "Confirmée" in page.row_text(test_car["name"]))


def test_admin_cancels_a_client_reservation(driver, api, client_user, test_car, future_dates, login_admin):
    start, end = future_dates
    api.create_reservation(api.login(client_user["email"], client_user["password"]), test_car["_id"], start, end)

    page = AdminReservationsPage(driver).open()
    assert page.has_row(test_car["name"])
    page.cancel(test_car["name"])
    page.wait.until(lambda d: "Annulée" in page.row_text(test_car["name"]))


def test_admin_creates_updates_and_deletes_a_client(driver, login_admin, unique_email, api, admin_token):
    email = unique_email("adminmade")
    page = AdminClientsPage(driver).open()

    page.add_client("Admin", "Made", "+216 20 555 666", email, "AdminMade123!")
    assert page.has_client(email)

    page.edit_phone(email, "+216 20 777 888")
    page.wait.until(lambda d: "777 888" in page.row_text(email))

    page.delete_client(email)
    page.wait.until(lambda d: not page.is_visible(page.row_with_text(email), timeout=1))


def test_admin_lists_registered_clients(driver, client_user, login_admin):
    page = AdminClientsPage(driver).open()
    assert page.has_client(client_user["email"])


def test_contact_message_reaches_the_admin_inbox_and_can_be_managed(driver, unique_email, cleanup, admin_credentials, login):
    email = unique_email("contact")
    subject = f"E2E subject {uuid.uuid4().hex[:8]}"
    cleanup["message_emails"].append(email)

    contact = ContactPage(driver).open()
    contact.send("Visitor", "Selenium", email, "20123456", subject, "Message envoyé par un test Selenium.")
    assert contact.success_text()

    login(admin_credentials["email"], admin_credentials["password"], expected_prefix="/dashboard")
    inbox = AdminMessagesPage(driver).open()
    assert inbox.has_message(subject)
    assert "Nouveau" in inbox.status_text(subject)

    inbox.click_action(subject, "Marquer lu")
    inbox.wait.until(lambda d: "Lu" in inbox.status_text(subject))

    inbox.click_action(subject, "Clôturer")
    inbox.wait.until(lambda d: "Clôturé" in inbox.status_text(subject))

    inbox.delete(subject)
    inbox.wait.until(lambda d: not inbox.is_visible(inbox.article(subject), timeout=1))
