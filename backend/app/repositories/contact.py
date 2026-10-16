"""Contact-message persistence for the SQLite database."""

from __future__ import annotations

import sqlite3
from datetime import UTC, datetime

from app.models.contact import ContactMessageRequest, ContactMessageResponse


class ContactMessageRepository:
    """Store fictional contact and interest records."""

    def __init__(self, connection: sqlite3.Connection):
        self.connection = connection

    def create(self, request: ContactMessageRequest, gateway_reference: str) -> ContactMessageResponse:
        cursor = self.connection.execute(
            """
            INSERT INTO contact_messages (
                message_type, name, email, subject, message, interest,
                gateway_reference, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request.type,
                request.name,
                request.email,
                request.subject,
                request.message,
                request.interest,
                gateway_reference,
                datetime.now(UTC).isoformat(),
            ),
        )
        return ContactMessageResponse(
            id=cursor.lastrowid,
            status="accepted",
            reference=gateway_reference,
        )

