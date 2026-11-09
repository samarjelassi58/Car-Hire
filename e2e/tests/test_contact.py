import pytest

from pages.admin_pages import ContactPage

pytestmark = pytest.mark.contact


def test_contact_form_sends_a_message(driver, unique_email, cleanup):
    email = unique_email("visitor")
    cleanup["message_emails"].append(email)

    page = ContactPage(driver).open()
    page.send("Visitor", "Selenium", email, "20123456", "Demande d'information", "Bonjour, ceci est un test automatisé.")
    assert page.success_text()


def test_contact_form_requires_an_email(driver):
    page = ContactPage(driver).open()
    page.send("Visitor", "Selenium", "", "20123456", "Sujet", "Message")
    assert page.current_path() == "/contact"
    assert not page.is_visible(("xpath", "//*[@role='status']"), timeout=2)
