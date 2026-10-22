"""Classroom-only bearer-token authentication primitives.

This module intentionally provides fictional, hard-coded credentials for local
course exercises. It does not provide production authentication, persistence,
expiration, refresh tokens, or credential logging.
"""

from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, Header, HTTPException


STUDENT_DEMO_TOKEN = "student-demo-token"
STAFF_DEMO_TOKEN = "staff-demo-token"


@dataclass(frozen=True)
class AuthenticatedPrincipal:
    """The identity and role represented by a valid classroom token."""

    role: str


class BearerTokenError(Exception):
    """A safe, expected failure while authenticating a bearer token."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = 401


_TOKEN_ROLES = {
    STUDENT_DEMO_TOKEN: "student",
    STAFF_DEMO_TOKEN: "staff",
}


def authenticate_authorization_header(authorization: str | None) -> AuthenticatedPrincipal:
    """Authenticate a classroom bearer token from an Authorization header.

    The header must use the standard ``Bearer <token>`` format. Missing,
    malformed, and unknown credentials all produce safe 401-class errors.
    The complete header and token are never logged or included in an error.
    """

    if authorization is None or not authorization.strip():
        raise BearerTokenError(
            "authentication_required",
            "A bearer token is required to access this resource.",
        )

    parts = authorization.strip().split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise BearerTokenError(
            "invalid_authentication",
            "Use the Authorization header format: Bearer <token>.",
        )

    role = _TOKEN_ROLES.get(parts[1])
    if role is None:
        raise BearerTokenError(
            "invalid_authentication",
            "The bearer token is not recognized.",
        )

    return AuthenticatedPrincipal(role=role)


def _authentication_http_exception(error: BearerTokenError) -> HTTPException:
    """Translate a safe authentication failure to the API error contract."""

    return HTTPException(
        status_code=error.status_code,
        detail={
            "code": error.code,
            "message": error.message,
            "fields": [],
        },
    )


def require_authenticated_principal(
    authorization: Annotated[str | None, Header()] = None,
) -> AuthenticatedPrincipal:
    """FastAPI dependency requiring any valid classroom bearer token."""

    try:
        return authenticate_authorization_header(authorization)
    except BearerTokenError as error:
        raise _authentication_http_exception(error) from error


def require_staff_principal(
    principal: Annotated[AuthenticatedPrincipal, Depends(require_authenticated_principal)],
) -> AuthenticatedPrincipal:
    """FastAPI dependency requiring a valid classroom staff token."""

    if principal.role != "staff":
        raise HTTPException(
            status_code=403,
            detail={
                "code": "forbidden",
                "message": "This resource requires staff authorization.",
                "fields": [],
            },
        )
    return principal


__all__ = [
    "AuthenticatedPrincipal",
    "BearerTokenError",
    "STAFF_DEMO_TOKEN",
    "STUDENT_DEMO_TOKEN",
    "authenticate_authorization_header",
    "require_authenticated_principal",
    "require_staff_principal",
]
