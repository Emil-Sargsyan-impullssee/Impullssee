# FastAPI backend

The project README contains the complete setup, PostgreSQL, environment, migration, admin, API, and deployment instructions.

From `backend/`, create/activate a Python virtualenv, install `requirements.txt`, copy `.env.example` to `.env`, configure the database and secrets, then run:

```bash
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

For local first-admin creation, run `python -m app.create_admin` after migrations and before starting the API. In production, set both `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend host's environment. FastAPI startup applies Alembic migrations first, then creates the Argon2-hashed admin only if that email is not already present. The bootstrap is safe on subsequent starts and does not reset an existing password. Use a unique password of 12–128 characters; never put it in frontend variables or commit it. Remove the two bootstrap variables from the host after the account has been created.

