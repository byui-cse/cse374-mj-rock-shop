"""Versioned API routes for the current application surface."""

from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.authentication import AuthenticatedPrincipal, require_staff_principal
from app.database import database_is_healthy
from app.models.catalog import CatalogProduct
from app.models.contact import ContactMessageRequest, ContactMessageResponse
from app.models.orders import OrderConfirmation, OrderCreateRequest, OrderQuoteRequest, OrderQuoteResponse
from app.repositories.products import product_repository
from app.services.catalog import CatalogService
from app.services.contact import ContactService, ContactServiceError
from app.services.orders import OrderService, OrderServiceError


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


def _order_error(error: OrderServiceError) -> HTTPException:
    fields = []
    if error.field:
        fields.append({"field": error.field, "message": error.message})
    return HTTPException(
        status_code=error.status_code,
        detail={"code": error.code, "message": error.message, "fields": fields},
    )


@router.post("/orders/quote", response_model=OrderQuoteResponse)
def order_quote(request: OrderQuoteRequest) -> OrderQuoteResponse:
    """Calculate an order quote and return eligible shipping options."""
    with product_repository() as repository:
        try:
            return OrderService(repository.connection).quote(request.product_id, request.quantity)
        except OrderServiceError as error:
            raise _order_error(error) from error


@router.post("/orders", response_model=OrderConfirmation, status_code=201)
def create_order(request: OrderCreateRequest) -> OrderConfirmation:
    """Create a completed mock order after payment and inventory checks."""
    with product_repository() as repository:
        try:
            return OrderService(repository.connection).create_order(
                product_id=request.product_id,
                quantity=request.quantity,
                customer=request.customer,
                shipping_carrier=request.shipping_carrier,
                shipping_service=request.shipping_service,
                card_number=request.card_number,
            )
        except OrderServiceError as error:
            raise _order_error(error) from error


@router.get(
    "/orders/{order_id}",
    response_model=OrderConfirmation,
    responses={
        401: {"description": "A valid bearer token is required."},
        403: {"description": "The token does not have staff authorization."},
        404: {"description": "The requested order was not found."},
    },
)
def get_order(
    order_id: int,
    _: AuthenticatedPrincipal = Depends(require_staff_principal),
) -> OrderConfirmation:
    """Return a safe order confirmation without customer or payment details."""
    with product_repository() as repository:
        order = OrderService(repository.connection).get_order(order_id)
    if order:
        return order
    raise HTTPException(
        status_code=404,
        detail={
            "code": "order_not_found",
            "message": "The requested order was not found.",
            "fields": [{"field": "order_id", "message": "Use an existing order ID."}],
        },
    )


def _contact_error(error: ContactServiceError) -> HTTPException:
    fields = []
    if error.field:
        fields.append({"field": error.field, "message": error.message})
    return HTTPException(
        status_code=422,
        detail={"code": error.code, "message": error.message, "fields": fields},
    )


@router.post("/contact-messages", response_model=ContactMessageResponse, status_code=201)
def create_contact_message(request: ContactMessageRequest) -> ContactMessageResponse:
    """Validate and store a fictional contact or interest record."""
    with product_repository() as repository:
        try:
            return ContactService(repository.connection).submit(request)
        except ContactServiceError as error:
            raise _contact_error(error) from error

