"""Convenience entry point: python app.py"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True, host="127.0.0.1", port=8010)
