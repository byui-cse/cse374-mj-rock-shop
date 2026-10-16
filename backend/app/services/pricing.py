"""Price and order-total rules independent of HTTP and persistence."""

from decimal import Decimal


class PricingService:
    """Calculate deterministic totals from prices and quantities."""

    @staticmethod
    def item_total(unit_price: Decimal | float | str, quantity: int) -> Decimal:
        if quantity < 1:
            raise ValueError("Quantity must be at least 1.")
        price = Decimal(str(unit_price))
        if price <= 0:
            raise ValueError("Unit price must be greater than zero.")
        return (price * quantity).quantize(Decimal("0.01"))

    def order_total(self, lines: list[tuple[Decimal | float | str, int]]) -> Decimal:
        return sum((self.item_total(price, quantity) for price, quantity in lines), Decimal("0.00"))

