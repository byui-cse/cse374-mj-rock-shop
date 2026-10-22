"""FastAPI application entry point for MJ's Rock Shop."""

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.api.errors import http_exception_handler, not_found_handler, validation_exception_handler
from app.api.routes import router


app = FastAPI(
    title="MJ's Rock Shop API",
    description="A teaching API for the CSE 374 software testing course.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(404, not_found_handler)
app.include_router(router)


def custom_openapi():
    """Add the classroom bearer scheme and protected-route metadata."""

    if app.openapi_schema:
        return app.openapi_schema

    app.openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    components = app.openapi_schema.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})
    security_schemes["bearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "description": "Use a fictional classroom token, such as staff-demo-token.",
    }

    order_route = app.openapi_schema.get("paths", {}).get("/api/orders/{order_id}", {}).get("get")
    if order_route is not None:
        order_route["security"] = [{"bearerAuth": []}]

    return app.openapi_schema


app.openapi = custom_openapi

