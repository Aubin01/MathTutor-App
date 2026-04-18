"""Small JSON-backed storage for tutor sessions."""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any

from .settings import DATA_DIR, SESSIONS_PATH


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class SessionStore:
    def __init__(self, path: Path = SESSIONS_PATH):
        self.path = path
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self._write({})

    def all(self) -> list[dict[str, Any]]:
        sessions = self._read()
        return sorted(
            sessions.values(),
            key=lambda item: item.get("created_at", ""),
            reverse=True,
        )

    def get(self, session_id: str) -> dict[str, Any] | None:
        return self._read().get(session_id)

    def save(self, session: dict[str, Any]) -> None:
        sessions = self._read()
        sessions[session["id"]] = session
        self._write(sessions)

    def delete(self, session_id: str) -> bool:
        sessions = self._read()
        if session_id not in sessions:
            return False
        del sessions[session_id]
        self._write(sessions)
        return True

    def _read(self) -> dict[str, dict[str, Any]]:
        try:
            with self.path.open("r", encoding="utf-8") as file:
                data = json.load(file)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

        if isinstance(data, dict):
            return data
        return {}

    def _write(self, data: dict[str, Any]) -> None:
        with self.path.open("w", encoding="utf-8") as file:
            json.dump(data, file, indent=2)
