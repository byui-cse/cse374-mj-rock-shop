"""Versioned API routes for the current application surface."""

from typing import Literal

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.database import database_is_healthy
from app.models.catalog import CatalogProduct
from app.repositories.products import product_repository
from app.services.catalog import CatalogService


router = APIRouter(prefix="/api")
catalog_service = CatalogService()


class DatabaseHealth(BaseModel):
    status: Literal["not_configured", "healthy", "unavailable"]


class HealthResponse(BaseModel):
    status: Literal["ok"]
    service: str
    database: DatabaseHealth


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Report API health and the database setup state."""
    return HealthResponse(
        status="ok",
        service="mj-rock-shop-api",
        database=DatabaseHealth(status="healthy" if database_is_healthy() else "unavailable"),
    )


@router.get("/products", response_model=list[CatalogProduct])
def products(
    search: str | None = Query(default=None),
    color: str | None = Query(default=None),
    geological_type: str | None = Query(default=None, alias="geologicalType"),
    mineral_status: Literal["mineral", "rock"] | None = Query(default=None, alias="mineralStatus"),
    condition: Literal["raw", "polished"] | None = Query(default=None),
    sort: Literal["featured", "name-asc", "price-asc", "price-desc"] = Query(default="featured"),
    available_only: bool = Query(default=True, alias="availableOnly"),
) -> list[CatalogProduct]:
    """Return products matching the catalog query."""
    with product_repository() as repository:
        return catalog_service.list_products(
            repository.list_all(),
            search=search,
            color=color,
            geological_type=geological_type,
            mineral_status=mineral_status,
            condition=condition,
            sort=sort,
            available_only=available_only,
        )


@router.get("/products/{product_id}", response_model=CatalogProduct)
def product(product_id: str) -> CatalogProduct:
    """Return one product or a consistent not-found error."""
    with product_repository() as repository:
        item = repository.get_by_id(product_id)
    if item:
        return item
    raise HTTPException(
        status_code=404,
        detail={
            "code": "product_not_found",
            "message": "The requested product was not found.",
            "fields": [{"field": "product_id", "message": "Use an existing product ID."}],
        },
    )

