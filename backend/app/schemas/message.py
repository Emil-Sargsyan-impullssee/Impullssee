from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class MessageStatusValue(str, Enum):
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class MessageCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    projectType: str = Field(min_length=2, max_length=80)
    budget: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=10, max_length=2000)

    @field_validator("name", "projectType", "budget", "message")
    @classmethod
    def trim_and_reject_empty(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field is required")
        return value


class MessageStatusUpdate(BaseModel):
    status: MessageStatusValue


class MessageRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    project_type: str
    budget: str
    message: str
    status: MessageStatusValue
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

