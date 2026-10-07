# FastAPI backend

The project README contains the complete setup, PostgreSQL, environment, migration, admin, API, and deployment instructions.

From `backend/`, create/activate a Python virtualenv, install `requirements.txt`, copy `.env.example` to `.env`, configure the database and secrets, then run:

```bash
alembic upgrade head
python -m app.create_admin
uvicorn app.main:app --reload --port 8000
```

