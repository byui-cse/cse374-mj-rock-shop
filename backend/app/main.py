"""FastAPI application entry point for MJ's Rock Shop."""

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

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

