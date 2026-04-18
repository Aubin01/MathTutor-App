# Tutor Backend

FastAPI backend for the math tutoring app.

It loads `OPENAI_API_KEY` from `.env`, creates private solutions, turns them into safe hints, and only returns the hints that the student has unlocked.

## Run

```bash
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8010
```
