"""Request and response models for fictional contact records."""

from typing import Literal

from pydantic import BaseModel, Field


class ContactMessageRequest(BaseModel):
    type: Literal["message", "interest"]
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=254)
    subject: str | None = Field(default=None, max_length=200)
    message: str | None = Field(default=None, max_length=5000)
    interest: str | None = Field(default=None, max_length=5000)


class ContactMessageResponse(BaseModel):
    id: int
    status: str
    reference: str

