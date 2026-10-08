# Impullssee Portfolio

A modern, responsive portfolio website for Emil Sargsyan - Frontend & Full Stack Developer.

## Current stack and setup

The current app is React + Vite with a FastAPI, PostgreSQL, SQLAlchemy, and Alembic backend. The public portfolio, pricing options, and Contact form design remain unchanged. The Contact form posts to `POST /api/messages`; the API validates and saves each request as `NEW` before optionally sending the existing Resend email notification. A notification failure does not fail an already-saved message.

### Requirements

- Node.js 20.19+ or 22.12
- Python 3.10+
- PostgreSQL 14+

### PostgreSQL

Create a local database and user with your PostgreSQL installation, for example:

```sql
CREATE USER impullssee WITH PASSWORD 'choose-a-local-password';
CREATE DATABASE impullssee OWNER impullssee;
```

Start the PostgreSQL service using its local service manager. A managed PostgreSQL provider can be used for deployment.

### FastAPI backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

The backend-specific `backend/.env.example` lists all backend settings: `DATABASE_URL` (PostgreSQL), `JWT_SECRET_KEY` (random, at least 32 characters), `FRONTEND_URL` (comma-separated origins), `JWT_ACCESS_TOKEN_MINUTES`, and `ENVIRONMENT`. Optional email settings are `RESEND_API_KEY`, `CONTACT_EMAIL`, and `RESEND_FROM_EMAIL`. Replace local placeholders in the ignored `backend/.env` only; set production values in the backend hosting provider. Generate a key with `python -c "import secrets; print(secrets.token_urlsafe(48))"`; never put backend secrets into frontend `VITE_*` variables.

Run the initial migration, create the first admin with the interactive password prompt, and start the API:

```powershell
alembic upgrade head
python -m app.create_admin
uvicorn app.main:app --reload --port 8000
```

The create-admin command requires a valid email and a 12+ character password; it stores only an Argon2 hash. Development API docs are at `http://localhost:8000/docs`.

### React frontend

From the repository root, run `npm install`, set `VITE_API_URL=http://localhost:8000` in `.env`, then run `npm run dev`. Set `VITE_API_URL` to the deployed FastAPI HTTPS origin in Vercel and redeploy. `vercel.json` routes direct `/admin/...` visits back to the React SPA.

### Admin routes

- `/admin/login` — sign in
- `/admin/dashboard` — message/content statistics and recent inquiries
- `/admin/messages` — view/filter requests, change status, delete
- `/admin/projects` — create, edit, feature, delete project records
- `/admin/services` — create, edit, activate/deactivate, delete services
- `/admin/settings` — informational account and security details

The browser holds the JWT in session storage. Admin API endpoints validate it on every request; logout revokes its token ID in PostgreSQL. Public project/service reads expose only featured projects and active services. Authenticated reads return all entries.

### REST API

`GET /api/health`; `POST /api/auth/login`; `POST /api/auth/logout`; `GET /api/auth/me`; `POST /api/messages`; admin `GET /api/messages`, `GET /api/messages/{id}`, `PATCH /api/messages/{id}`, `DELETE /api/messages/{id}`; `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/{id}`; `GET/POST /api/services`, `GET/PUT/DELETE /api/services/{id}`. Public contact submissions are limited to 5 per 15 minutes per IP. Admin login is limited to 5 attempts per minute per IP. Message statuses are `NEW`, `CONTACTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.

### Deployment and verification

Deploy the frontend to Vercel and `backend/` to a Python host. Configure backend `DATABASE_URL`, strong `JWT_SECRET_KEY`, and `FRONTEND_URL=https://impulse-tan.vercel.app`. FastAPI startup applies Alembic migrations before serving requests. To create the first production admin on Render Free, configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the Render backend's Environment settings; startup creates the admin once with an Argon2 hash if that email is absent. Use a unique 12–128 character password, remove both variables after the account is created, then log in at `https://impulse-tan.vercel.app/admin`. Keep the database private and use its TLS URL. Both the contact and admin-login limits use in-memory storage, so they are process-local and are suitable for one API process; use a shared gateway limiter for multiple instances.

Run the browser build/lint from the root and the self-contained API workflow checks from `backend/`:

```powershell
npm run lint
npm run build
cd backend
python -m unittest discover -s tests -v
python -m compileall app alembic
```

The API tests use an in-memory SQLite database to verify auth, validation, contact persistence, CRUD, rate limiting, and token revocation. For PostgreSQL, also run `alembic upgrade head` and verify the service against your configured database. PostgreSQL is not bundled with this repository.

## License

ISC

