import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

BASE_URL = os.getenv("E2E_BASE_URL", "http://localhost:5173").rstrip("/")
API_URL = os.getenv("E2E_API_URL", "http://localhost:5000").rstrip("/")
ADMIN_EMAIL = os.getenv("E2E_ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.getenv("E2E_ADMIN_PASSWORD", "")
DEFAULT_TIMEOUT = int(os.getenv("E2E_TIMEOUT", "10"))
SCREENSHOT_DIR = Path(__file__).parent / "reports" / "screenshots"
