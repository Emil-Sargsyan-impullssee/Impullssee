from getpass import getpass

from pydantic import EmailStr, TypeAdapter, ValidationError

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import Admin


def main() -> None:
    adapter = TypeAdapter(EmailStr)
    while True:
        try:
            email = str(adapter.validate_python(input("Admin email: ").strip())).lower()
            break
        except ValidationError:
            print("Enter a valid email address.")
    while True:
        password = getpass("Admin password (at least 12 characters): ")
        if len(password) >= 12:
            break
        print("Choose a password with at least 12 characters.")

    with SessionLocal() as db:
        if db.query(Admin).filter(Admin.email == email).first():
            raise SystemExit("An admin with that email already exists.")
        db.add(Admin(email=email, password_hash=hash_password(password)))
        db.commit()
    print(f"Admin account created for {email}.")


if __name__ == "__main__":
    main()

