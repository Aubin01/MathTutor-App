# Tutor App

A math tutoring app based on the two-step hinting research in `/home/aubin.mugisha/Tutor`.

The app has:

- a FastAPI backend in `apps/backend`
- a React/Vite frontend in `apps/frontend`
- one-hint-at-a-time tutoring sessions
- strict answer leakage checks before replies are shown

## Run

Backend:

```bash
cd apps/backend
python -m venv .venv
.venv/bin/pip install -r requirements.txt
python app.py
```

Frontend:

```bash
cd apps/frontend
npm install
npm run dev
```
