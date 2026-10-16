"""Shared error types and exception handlers for the HTTP API."""

from collections.abc import Iterable
from typing import Any

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def error_payload(code: str, message: str, fields: Iterable[dict[str, Any]] = ()) -> dict[str, Any]:
    """Build the public error shape used by every API error response."""
    return {
        "error": {
            "code": code,
            "message": message,
            "fields": list(fields),
        }
    }


async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    """Convert FastAPI HTTP exceptions to the public error shape."""
    detail = exc.detail
    if isinstance(detail, dict):
        code = detail.get("code", "http_error")
        message = detail.get("message", "The request could not be completed.")
        fields = detail.get("fields", [])
    else:
        code = "http_error"
        message = str(detail)
        fields = []
    return JSONResponse(status_code=exc.status_code, content=error_payload(code, message, fields))


async def not_found_handler(_: Request, __: Exception) -> JSONResponse:
    """Return a predictable response when no route matches."""
    return JSONResponse(
        status_code=404,
        content=error_payload("not_found", "The requested resource was not found."),
    )


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    """Return field-level details for request validation failures."""
    fields = [
        {
            "field": ".".join(str(part) for part in error["loc"] if part != "body"),
            "message": error["msg"],
            "type": error["type"],
        }
        for error in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content=error_payload("validation_error", "Request validation failed.", fields),
    )

