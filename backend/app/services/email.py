from html import escape

import httpx

from app.core.config import get_settings
from app.models import Message


def send_message_notification(message: Message) -> None:
    settings = get_settings()
    safe_message = escape(message.message).replace("\n", "<br>")
    fields = {
        "Name": message.name,
        "Email": message.email,
        "Project Type": message.project_type,
        "Budget": message.budget,
        "Message": safe_message,
    }
    content = "".join(
        f'<p><strong>{escape(label)}:</strong><br>{value if label == "Message" else escape(value)}</p>'
        for label, value in fields.items()
    )
    response = httpx.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {settings.resend_api_key}"},
        json={
            "from": settings.resend_from_email,
            "to": [settings.contact_email],
            "reply_to": message.email,
            "subject": f"New Contact Form Submission from {message.name}",
            "html": f"<div style='font-family:Arial,sans-serif;line-height:1.6'>{content}</div>",
        },
        timeout=10,
    )
    response.raise_for_status()

