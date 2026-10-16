"""Validation and orchestration for fictional contact messages."""

from __future__ import annotations

import re
import sqlite3

from app.adapters.local import LocalMessageGateway
from app.adapters.protocols import MessageGateway
from app.models.contact import ContactMessageRequest, ContactMessageResponse
from app.repositories.contact import ContactMessageRepository


class ContactServiceError(Exception):
    """A safe, expected contact-submission failure."""

    def __init__(self, code: str, message: str, field: str | None = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.field = field


class ContactService:
    """Validate and store messages without sending real communication."""

    def __init__(self, connection: sqlite3.Connection, *, gateway: MessageGateway | None = None):
        self.connection = connection
        self.repository = ContactMessageRepository(connection)
        self.gateway = gateway or LocalMessageGateway()

    def submit(self, request: ContactMessageRequest) -> ContactMessageResponse:
        self._validate(request)
        record = {
            "type": request.type,
            "name": request.name,
            "email": request.email,
            "subject": request.subject or "",
            "message": request.message or "",
            "interest": request.interest or "",
        }
        receipt = self.gateway.record(record)
        with self.connection:
            return self.repository.create(request, receipt.reference)

    @staticmethod
    def _validate(request: ContactMessageRequest) -> None:
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", request.email):
            raise ContactServiceError("invalid_email", "Enter an email address in a format like name@example.com.", "email")
        if request.type == "message" and not (request.message or "").strip():
            raise ContactServiceError("message_required", "A message is required.", "message")
        if request.type == "interest" and not (request.interest or "").strip():
            raise ContactServiceError("interest_required", "An interest description is required.", "interest")

