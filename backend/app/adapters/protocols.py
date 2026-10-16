"""Interfaces for services that would normally be external."""

from dataclasses import dataclass
from decimal import Decimal
from typing import Protocol

from app.models.catalog import CatalogProduct
from app.services.shipping import ShippingOption


@dataclass(frozen=True)
class PaymentAuthorization:
    status: str
    safe_reference: str | None
    message: str


@dataclass(frozen=True)
class MessageReceipt:
    status: str
    reference: str


class PaymentGateway(Protocol):
    def authorize(self, card_number: str, amount: Decimal) -> PaymentAuthorization:
        """Authorize fictional payment without retaining the complete card number."""


class ShippingGateway(Protocol):
    def options(self, product: CatalogProduct) -> list[ShippingOption]:
        """Return eligible fictional shipping options."""


class MessageGateway(Protocol):
    def record(self, message: dict[str, str]) -> MessageReceipt:
        """Record a fictional message without sending email."""

