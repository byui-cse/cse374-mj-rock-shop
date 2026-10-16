"""Repeatable classroom scenario definitions."""

from dataclasses import dataclass


@dataclass(frozen=True)
class PaymentScenario:
    name: str
    status: str
    message: str


class ScenarioService:
    """Map fictional inputs to predictable demonstration outcomes."""

    success_card = "4242 4242 4242 4242"
    decline_card = "4000 0000 0000 0002"

    def payment_scenario(self, card_number: str) -> PaymentScenario:
        normalized = "".join(card_number.split())
        if len(normalized) != 16 or not normalized.isdigit():
            return PaymentScenario("invalid", "invalid", "Enter a 16-digit fictional test card number.")
        if normalized == self.decline_card.replace(" ", ""):
            return PaymentScenario("declined", "declined", "The mock payment provider declined this payment.")
        return PaymentScenario("approved", "approved", "The mock payment provider approved this payment.")

