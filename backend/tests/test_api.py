import os
import unittest

os.environ["DATABASE_URL"] = "sqlite+pysqlite://"
os.environ["JWT_SECRET_KEY"] = "local-test-only-secret-key-32-characters-minimum"
os.environ["FRONTEND_URL"] = "http://testserver"
os.environ.pop("RESEND_API_KEY", None)
os.environ.pop("CONTACT_EMAIL", None)

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.core.rate_limiter import limiter  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Admin, Message, Project, RevokedToken, Service  # noqa: E402


class ApiWorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = create_engine(
            "sqlite+pysqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        cls.sessions = sessionmaker(bind=cls.engine, autoflush=False, expire_on_commit=False)
        cls.password = "local-test-password-not-for-production"
        cls.password_hash = hash_password(cls.password)

        def override_get_db():
            db = cls.sessions()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        app.dependency_overrides.clear()
        Base.metadata.drop_all(cls.engine)
        cls.engine.dispose()

    def setUp(self):
        limiter.limiter.storage.reset()
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)
        with self.sessions() as db:
            db.add(Admin(email="admin@example.com", password_hash=self.password_hash))
            db.commit()
        self.token = None

    def admin_headers(self):
        if self.token is None:
            result = self.client.post(
                "/api/auth/login",
                json={"email": "admin@example.com", "password": self.password},
            )
            self.assertEqual(result.status_code, 200, result.text)
            self.token = result.json()["access_token"]
        return {"Authorization": f"Bearer {self.token}"}

    def create_message(self):
        return self.client.post(
            "/api/messages",
            json={
                "name": "Morgan Example",
                "email": "morgan@example.com",
                "projectType": "Landing Page",
                "budget": "$500 – $1,000",
                "message": "I need a responsive portfolio website.",
            },
        )

    def test_public_contact_is_validated_and_saved(self):
        response = self.create_message()
        self.assertEqual(response.status_code, 201, response.text)
        self.assertEqual(response.json()["status"], "NEW")
        with self.sessions() as db:
            saved = db.query(Message).one()
            self.assertEqual(saved.email, "morgan@example.com")
            self.assertEqual(saved.project_type, "Landing Page")

    def test_invalid_public_contact_is_rejected(self):
        response = self.client.post("/api/messages", json={"email": "not-an-email"})
        self.assertEqual(response.status_code, 422)
        self.assertEqual(self.client.get("/api/messages").status_code, 401)

    def test_public_contact_is_rate_limited(self):
        for _ in range(5):
            self.assertEqual(self.create_message().status_code, 201)
        self.assertEqual(self.create_message().status_code, 429)

    def test_admin_login_succeeds_and_protected_routes_remain_protected(self):
        response = self.client.post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": self.password},
        )
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["admin"]["email"], "admin@example.com")
        self.assertTrue(response.json()["access_token"])
        self.assertEqual(self.client.get("/api/messages").status_code, 401)

    def test_admin_login_is_rate_limited_per_client_ip(self):
        for _ in range(5):
            response = self.client.post(
                "/api/auth/login",
                json={"email": "admin@example.com", "password": "incorrect-password"},
            )
            self.assertEqual(response.status_code, 401, response.text)

        self.assertEqual(self.create_message().status_code, 201)
        blocked = self.client.post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": self.password},
        )
        self.assertEqual(blocked.status_code, 429, blocked.text)
        self.assertEqual(blocked.json()["detail"], "Too many requests. Please try again later.")

    def test_message_admin_workflow_and_dashboard_stats(self):
        created = self.create_message()
        message_id = created.json()["id"]
        headers = self.admin_headers()
        self.assertEqual(self.client.get("/api/auth/me", headers=headers).status_code, 200)
        self.assertEqual(len(self.client.get("/api/messages", headers=headers).json()), 1)
        changed = self.client.patch(f"/api/messages/{message_id}", headers=headers, json={"status": "IN_PROGRESS"})
        self.assertEqual(changed.status_code, 200, changed.text)
        self.assertEqual(changed.json()["status"], "IN_PROGRESS")
        stats = self.client.get("/api/messages/stats", headers=headers)
        self.assertEqual(stats.status_code, 200, stats.text)
        self.assertEqual(stats.json()["in_progress_messages"], 1)
        self.assertEqual(self.client.delete(f"/api/messages/{message_id}", headers=headers).status_code, 204)

    def test_project_admin_crud_and_public_visibility(self):
        payload = {
            "title": "Private Draft",
            "description": "A project entry used for API workflow verification.",
            "technologies": ["React", "FastAPI"],
            "image_url": "https://example.com/image.png",
            "live_url": None,
            "github_url": None,
            "featured": False,
        }
        self.assertEqual(self.client.post("/api/projects", json=payload).status_code, 401)
        headers = self.admin_headers()
        created = self.client.post("/api/projects", headers=headers, json=payload)
        self.assertEqual(created.status_code, 201, created.text)
        project_id = created.json()["id"]
        self.assertEqual(self.client.get("/api/projects").json(), [])
        self.assertEqual(len(self.client.get("/api/projects", headers=headers).json()), 1)
        payload["featured"] = True
        updated = self.client.put(f"/api/projects/{project_id}", headers=headers, json=payload)
        self.assertEqual(updated.status_code, 200, updated.text)
        self.assertEqual(len(self.client.get("/api/projects").json()), 1)
        self.assertEqual(self.client.delete(f"/api/projects/{project_id}", headers=headers).status_code, 204)

    def test_service_activation_and_public_visibility(self):
        payload = {"name": "Web Build", "description": "Responsive website development", "price": 250, "active": True}
        headers = self.admin_headers()
        created = self.client.post("/api/services", headers=headers, json=payload)
        self.assertEqual(created.status_code, 201, created.text)
        service_id = created.json()["id"]
        self.assertEqual(len(self.client.get("/api/services").json()), 1)
        payload["active"] = False
        updated = self.client.put(f"/api/services/{service_id}", headers=headers, json=payload)
        self.assertEqual(updated.status_code, 200, updated.text)
        self.assertEqual(self.client.get("/api/services").json(), [])
        self.assertEqual(self.client.delete(f"/api/services/{service_id}", headers=headers).status_code, 204)

    def test_logout_revokes_the_access_token(self):
        headers = self.admin_headers()
        self.assertEqual(self.client.post("/api/auth/logout", headers=headers).status_code, 200)
        self.assertEqual(self.client.get("/api/auth/me", headers=headers).status_code, 401)
        with self.sessions() as db:
            self.assertEqual(db.query(RevokedToken).count(), 1)


if __name__ == "__main__":
    unittest.main()
