"""Deterministic local adapters used by the classroom application."""

from decimal import Decimal

from app.adapters.protocols import MessageReceipt, PaymentAuthorization
from app.services.scenarios import ScenarioService
from app.services.shipping import ShippingOption, ShippingService
from app.models.catalog import CatalogProduct


class LocalPaymentGateway:
    """Return repeatable payment outcomes without contacting a provider."""

    def __init__(self, scenarios: ScenarioService | None = None):
        self.scenarios = scenarios or ScenarioService()

    def authorize(self, card_number: str, amount: Decimal) -> PaymentAuthorization:
        scenario = self.scenarios.payment_scenario(card_number)
        if scenario.status != "approved":
            return PaymentAuthorization(scenario.status, None, scenario.message)
        normalized = "".join(card_number.split())
        return PaymentAuthorization("approved", f"mock-card-{normalized[-4:]}", scenario.message)


class LocalShippingGateway:
    """Return product shipping options without contacting a carrier."""

    def __init__(self, shipping_service: ShippingService | None = None):
        self.shipping_service = shipping_service or ShippingService()

    def options(self, product: CatalogProduct) -> list[ShippingOption]:
        return self.shipping_service.eligible_options(product)


class LocalMessageGateway:
    """Store fictional messages in memory without sending email."""

    def __init__(self):
        self.records: list[dict[str, str]] = []

    def record(self, message: dict[str, str]) -> MessageReceipt:
        self.records.append(dict(message))
        return MessageReceipt(status="recorded", reference=f"mock-message-{len(self.records):04d}")

