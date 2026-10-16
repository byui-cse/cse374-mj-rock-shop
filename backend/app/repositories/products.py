"""Product repository backed by SQLite."""

from __future__ import annotations

import json
import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager

from app.database import connect, database_path, ensure_seeded
from app.models.catalog import CatalogProduct


class ProductRepository:
    """Read catalog products without exposing SQL to API routes or services."""

    def __init__(self, connection: sqlite3.Connection):
        self.connection = connection

    def list_all(self) -> list[CatalogProduct]:
        rows = self.connection.execute(
            "SELECT * FROM products ORDER BY id"
        ).fetchall()
        return [self._to_product(row) for row in rows]

    def get_by_id(self, product_id: str) -> CatalogProduct | None:
        row = self.connection.execute(
            "SELECT * FROM products WHERE id = ?", (product_id,)
        ).fetchone()
        return self._to_product(row) if row else None

    def count(self) -> int:
        return self.connection.execute("SELECT COUNT(*) FROM products").fetchone()[0]

    def _to_product(self, row: sqlite3.Row) -> CatalogProduct:
        shipping_rows = self.connection.execute(
            """
            SELECT carrier, service
            FROM product_shipping_options
            WHERE product_id = ?
            ORDER BY carrier, service
            """,
            (row["id"],),
        ).fetchall()
        shipping: dict[str, list[str]] = {}
        for shipping_row in shipping_rows:
            shipping.setdefault(shipping_row["carrier"], []).append(shipping_row["service"])
        return CatalogProduct(
            id=row["id"],
            name=row["name"],
            description=row["description"],
            price=float(row["price"]),
            image=row["image"],
            imageAlt=row["image_alt"],
            available=bool(row["active"] and row["inventory_quantity"] > 0),
            popular=bool(row["popular"]),
            color=row["color"],
            tags=json.loads(row["tags_json"]),
            geologicalType=row["geological_type"],
            isMineral=None if row["is_mineral"] is None else bool(row["is_mineral"]),
            condition=row["specimen_condition"],
            safetyWarning=row["safety_warning"],
            handlingWarning=row["handling_warning"],
            shipping=shipping,
        )


@contextmanager
def product_repository() -> Iterator[ProductRepository]:
    """Open a seeded repository for one request and close it afterward."""
    ensure_seeded(database_path())
    connection = connect(database_path())
    try:
        yield ProductRepository(connection)
    finally:
        connection.close()

