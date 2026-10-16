"""Order orchestration independent of HTTP route handling."""

from __future__ import annotations

import sqlite3
from decimal import Decimal
from uuid import uuid4

from app.adapters.local import LocalPaymentGateway, LocalShippingGateway
from app.adapters.protocols import PaymentGateway, ShippingGateway
from app.models.orders import CustomerInformation, OrderConfirmation, OrderQuoteResponse, ShippingOptionResponse
from app.repositories.orders import OrderRepository
from app.repositories.products import ProductRepository
from app.services.pricing import PricingService
from app.services.shipping import ShippingOption, ShippingService


class OrderServiceError(Exception):
    """A safe, expected order-flow failure for the API layer."""

    def __init__(self, code: str, message: str, status_code: int = 409, field: str | None = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.field = field


class OrderService:
    """Coordinate product, pricing, shipping, payment, and persistence."""

    def __init__(
        self,
        connection: sqlite3.Connection,
        *,
        payment_gateway: PaymentGateway | None = None,
        shipping_gateway: ShippingGateway | None = None,
        pricing_service: PricingService | None = None,
    ):
        self.connection = connection
        self.products = ProductRepository(connection)
        self.orders = OrderRepository(connection)
        self.payment_gateway = payment_gateway or LocalPaymentGateway()
        self.shipping_gateway = shipping_gateway or LocalShippingGateway()
        self.pricing = pricing_service or PricingService()

    def quote(self, product_id: str, quantity: int) -> OrderQuoteResponse:
        product = self._available_product(product_id, quantity)
        options = self.shipping_gateway.options(product)
        subtotal = self.pricing.item_total(product.price, quantity)
        return OrderQuoteResponse(
            product_id=product.id,
            product_name=product.name,
            quantity=quantity,
            subtotal=float(subtotal),
            total=float(subtotal),
            shipping_options=[self._shipping_response(option) for option in options],
        )

    def create_order(
        self,
        *,
        product_id: str,
        quantity: int,
        customer: CustomerInformation,
        shipping_carrier: str,
        shipping_service: str,
        card_number: str,
    ) -> OrderConfirmation:
        product = self._available_product(product_id, quantity)
        shipping = self._shipping_option(product, shipping_carrier, shipping_service)
        total = self.pricing.item_total(product.price, quantity)
        authorization = self.payment_gateway.authorize(card_number, total)
        if authorization.status != "approved":
            raise OrderServiceError(
                f"payment_{authorization.status}",
                authorization.message,
                402 if authorization.status == "declined" else 422,
                "card_number",
            )

        with self.connection:
            changed = self.connection.execute(
                """
                UPDATE products
                SET inventory_quantity = inventory_quantity - ?,
                    version = version + 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND active = 1 AND inventory_quantity >= ?
                """,
                (quantity, product.id, quantity),
            ).rowcount
            if changed != 1:
                raise OrderServiceError("inventory_unavailable", "The requested quantity is no longer available.")
            return self.orders.create_order(
                order_number=f"MJ-{uuid4().hex[:8].upper()}",
                customer=customer,
                product_id=product.id,
                product_name=product.name,
                quantity=quantity,
                unit_price=Decimal(str(product.price)),
                total=total,
                shipping=shipping,
                payment_reference=authorization.safe_reference or "mock-payment",
            )

    def get_order(self, order_id: int) -> OrderConfirmation | None:
        return self.orders.get_confirmation(order_id)

    def _available_product(self, product_id: str, quantity: int):
        product = self.products.get_by_id(product_id)
        if not product:
            raise OrderServiceError("product_not_found", "The requested product was not found.", 404, "product_id")
        inventory = self.products.inventory_quantity(product_id)
        if not product.available:
            raise OrderServiceError("product_unavailable", "This product is currently unavailable.")
        if quantity > inventory:
            raise OrderServiceError("quantity_unavailable", "The requested quantity is not available.", 409, "quantity")
        return product

    def _shipping_option(self, product, carrier: str, service: str) -> ShippingOption:
        option = next(
            (item for item in self.shipping_gateway.options(product) if item.carrier == carrier and item.service == service),
            None,
        )
        if not option:
            raise OrderServiceError("shipping_unavailable", "That shipping option is not available for this product.", 422, "shipping_service")
        return option

    @staticmethod
    def _shipping_response(option: ShippingOption) -> ShippingOptionResponse:
        return ShippingOptionResponse(
            carrier=option.carrier,
            service=option.service,
            estimated_delivery=option.estimated_delivery,
        )

