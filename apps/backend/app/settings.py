"""App settings and environment loading for the tutor backend."""

from __future__ import annotations

from pathlib import Path
import os

from dotenv import load_dotenv


APP_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = APP_ROOT / "data"
SESSIONS_PATH = DATA_DIR / "sessions.json"

TUTOR_ENV_PATH = Path("/home/aubin.mugisha/Tutor/.env")
load_dotenv(TUTOR_ENV_PATH)
load_dotenv(APP_ROOT / ".env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

SOLVER_MODEL = os.getenv("OPENAI_SOLVER_MODEL", "gpt-5.2")
HINT_MODEL = os.getenv("OPENAI_HINT_MODEL", "gpt-5-mini")
FOLLOWUP_MODEL = os.getenv("OPENAI_FOLLOWUP_MODEL", "gpt-5-mini")

DEFAULT_STRICTNESS = os.getenv("TUTOR_DEFAULT_STRICTNESS", "strict")
DEFAULT_MAX_HINTS = int(os.getenv("TUTOR_DEFAULT_MAX_HINTS", "5"))
HARD_MAX_HINTS = int(os.getenv("TUTOR_HARD_MAX_HINTS", "5"))

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
ALLOWED_ORIGIN_REGEX = r"http://(localhost|127\.0\.0\.1):\d+"
