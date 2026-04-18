# Tutor Frontend

React + TypeScript frontend for the math tutoring app.

## Project Structure

### `src/` directory

The `src/` directory contains all frontend application code for this app.

- `assets/`: static assets such as images, icons, fonts, and other media used by the UI.

Most of the tutoring flow lives in `src/pages/ChatPage.tsx`, `src/components/chat`, and `src/services/chatService.ts`.

## Setup

```bash
cd apps/frontend
npm install
```

## Development

```bash
npm run dev
```

The app expects the backend at `http://127.0.0.1:8010/api` unless `VITE_API_URL` is set.

## Build

```bash
npm run build
```

Build artifacts will be output to the `dist/` directory.
