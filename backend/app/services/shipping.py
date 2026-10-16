"""Shipping eligibility rules for fictional local carriers."""

from dataclasses import dataclass

from app.models.catalog import CatalogProduct


@dataclass(frozen=True)
class ShippingOption:
    carrier: str
    service: str
    estimated_delivery: str = "Generally within one week"


class ShippingService:
    """Translate product shipping data into selectable options."""

    def eligible_options(self, product: CatalogProduct) -> list[ShippingOption]:
        return [
            ShippingOption(carrier=carrier, service=service)
            for carrier, services in product.shipping.items()
            for service in services
        ]

    def is_available(self, product: CatalogProduct) -> bool:
        return bool(self.eligible_options(product))

