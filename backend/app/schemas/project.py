from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class ProjectBase(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    description: str = Field(min_length=1, max_length=5000)
    technologies: list[str] = Field(default_factory=list, max_length=30)
    image_url: HttpUrl | None = None
    live_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

