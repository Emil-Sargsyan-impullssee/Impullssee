from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.dependencies.auth import require_admin
from app.models import Admin, Message, MessageStatus, Project, RevokedToken, Service
from app.schemas.message import MessageCreate, MessageRead, MessageStatusUpdate

router = APIRouter(prefix="/api/messages", tags=["messages"])


def _notify_owner(message: Message) -> None:
    from app.core.config import get_settings
    from app.services.email import send_message_notification

    settings = get_settings()
    if not settings.resend_api_key or not settings.contact_email:
        return
    try:
        send_message_notification(message)
    except Exception:
        import logging

        logging.getLogger(__name__).exception("Contact email notification failed after message was saved")


@router.post("", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/15minutes")
def create_message(request: Request, payload: MessageCreate, db: Session = Depends(get_db)) -> Message:
    message = Message(
        name=payload.name,
        email=str(payload.email),
        project_type=payload.projectType,
        budget=payload.budget,
        message=payload.message,
        status=MessageStatus.NEW,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    _notify_owner(message)
    return message


@router.get("", response_model=list[MessageRead])
def list_messages(
    status_filter: MessageStatus | None = Query(default=None, alias="status"),
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
) -> list[Message]:
    query = db.query(Message)
    if status_filter:
        query = query.filter(Message.status == status_filter)
    return query.order_by(Message.created_at.desc()).offset(offset).limit(limit).all()


@router.get("/stats")
def message_stats(db: Session = Depends(get_db), _: Admin = Depends(require_admin)) -> dict[str, object]:
    counts = {status.value: count for status, count in db.query(Message.status, func.count(Message.id)).group_by(Message.status).all()}
    return {
        "total_messages": sum(counts.values()),
        "new_messages": counts.get("NEW", 0),
        "contacted_messages": counts.get("CONTACTED", 0),
        "in_progress_messages": counts.get("IN_PROGRESS", 0),
        "completed_messages": counts.get("COMPLETED", 0),
        "cancelled_messages": counts.get("CANCELLED", 0),
        "total_projects": db.query(func.count(Project.id)).scalar() or 0,
        "active_services": db.query(func.count(Service.id)).filter(Service.active.is_(True)).scalar() or 0,
        "recent_messages": [
            MessageRead.model_validate(message).model_dump(mode="json")
            for message in db.query(Message).order_by(Message.created_at.desc()).limit(6).all()
        ],
    }


@router.get("/{message_id}", response_model=MessageRead)
def get_message(message_id: int, db: Session = Depends(get_db), _: Admin = Depends(require_admin)) -> Message:
    message = db.get(Message, message_id)
    if message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@router.patch("/{message_id}", response_model=MessageRead)
def update_message(message_id: int, payload: MessageStatusUpdate, db: Session = Depends(get_db), _: Admin = Depends(require_admin)) -> Message:
    message = db.get(Message, message_id)
    if message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    message.status = MessageStatus(payload.status.value)
    db.commit()
    db.refresh(message)
    return message


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(message_id: int, db: Session = Depends(get_db), _: Admin = Depends(require_admin)) -> Response:
    message = db.get(Message, message_id)
    if message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

