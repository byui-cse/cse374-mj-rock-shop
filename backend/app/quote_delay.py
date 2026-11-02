"""Configurable local latency simulation for order quotes."""

from __future__ import annotations

import asyncio
import random
from dataclasses import dataclass
from typing import Awaitable, Callable


MAX_DELAY_MS = 30_000
QUOTE_DELAY_ENABLED = True
QUOTE_DELAY_MIN_MS = 100
QUOTE_DELAY_MAX_MS = 2_000
QUOTE_DELAY_CUTOFF_MS = 750


@dataclass(frozen=True)
class QuoteDelaySettings:
    enabled: bool = QUOTE_DELAY_ENABLED
    min_ms: int = QUOTE_DELAY_MIN_MS
    max_ms: int = QUOTE_DELAY_MAX_MS
    cutoff_ms: int = QUOTE_DELAY_CUTOFF_MS

    def __post_init__(self) -> None:
        for name, value in (("min_ms", self.min_ms), ("max_ms", self.max_ms), ("cutoff_ms", self.cutoff_ms)):
            if not isinstance(value, int) or value < 0 or value > MAX_DELAY_MS:
                raise ValueError(f"{name} must be between 0 and {MAX_DELAY_MS} milliseconds")
        if self.min_ms > self.max_ms:
            raise ValueError("min_ms must be less than or equal to max_ms")


class QuoteDelaySimulator:
    """Choose a per-request wait and signal when it exceeds the timeout cutoff."""

    def __init__(
        self,
        settings: QuoteDelaySettings,
        *,
        choose_delay_ms: Callable[[int, int], int] = random.randint,
        sleep: Callable[[float], Awaitable[None]] = asyncio.sleep,
    ):
        self.settings = settings
        self._choose_delay_ms = choose_delay_ms
        self._sleep = sleep

    async def wait_for_quote(self) -> bool:
        """Return True when the quote timed out, otherwise False."""
        if not self.settings.enabled:
            return False

        delay_ms = self._choose_delay_ms(self.settings.min_ms, self.settings.max_ms)
        if delay_ms < self.settings.min_ms or delay_ms > self.settings.max_ms:
            raise ValueError("chosen delay is outside the configured range")

        timed_out = delay_ms > self.settings.cutoff_ms
        wait_ms = min(delay_ms, self.settings.cutoff_ms)
        await self._sleep(wait_ms / 1000)
        return timed_out


quote_delay_simulator = QuoteDelaySimulator(QuoteDelaySettings())
