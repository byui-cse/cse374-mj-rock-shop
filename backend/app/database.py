"""SQLite connection, initialization, and reset helpers."""

from __future__ import annotations

import os
import json
import sqlite3
from contextlib import closing
from pathlib import Path

from app.models.catalog import CATALOG, CatalogProduct


BACKEND_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_PATH = BACKEND_DIR / "data" / "rock_shop.db"
SCHEMA_PATH = Path(__file__).resolve().with_name("schema.sql")


def database_path() -> Path:
    """Return the configured database path or the local default."""
    configured_path = os.environ.get("ROCK_SHOP_DB_PATH")
    return Path(configured_path) if configured_path else DEFAULT_DATABASE_PATH


def connect(path: Path | str | None = None) -> sqlite3.Connection:
    """Open a SQLite connection with foreign-key checks enabled."""
    selected_path = Path(path) if path else database_path()
    if selected_path != Path(":memory:"):
        selected_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(":memory:" if selected_path == Path(":memory:") else selected_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize(connection: sqlite3.Connection) -> None:
    """Create the schema if it does not already exist."""
    connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    connection.commit()


def seed(connection: sqlite3.Connection) -> None:
    """Insert the deterministic catalog into an initialized empty database."""
    for product in CATALOG:
        _insert_product(connection, product)
    connection.commit()


def ensure_seeded(path: Path | str | None = None) -> None:
    """Create and seed the database when it has no products."""
    with closing(connect(path)) as connection:
        initialize(connection)
        count = connection.execute("SELECT COUNT(*) FROM products").fetchone()[0]
        if count == 0:
            seed(connection)


def reset(path: Path | str | None = None) -> None:
    """Drop the local classroom tables, recreate them, and seed known data."""
    with closing(connect(path)) as connection:
        connection.executescript(
            """
            DROP TABLE IF EXISTS order_items;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS contact_messages;
            DROP TABLE IF EXISTS product_shipping_options;
            DROP TABLE IF EXISTS products;
            """
        )
        initialize(connection)
        seed(connection)


def database_is_healthy(path: Path | str | None = None) -> bool:
    """Return whether the database can be opened and queried."""
    try:
        ensure_seeded(path)
        with closing(connect(path)) as connection:
            connection.execute("SELECT 1").fetchone()
        return True
    except sqlite3.Error:
        return False


def _insert_product(connection: sqlite3.Connection, product: CatalogProduct) -> None:
    connection.execute(
        """
        INSERT INTO products (
            id, name, description, price, image, image_alt, popular, color,
            tags_json, geological_type, is_mineral, specimen_condition,
            safety_warning, handling_warning, inventory_quantity, active,
            updated_at, version
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            product.id,
            product.name,
            product.description,
            product.price,
            product.image,
            product.imageAlt,
            int(product.popular),
            product.color,
            json.dumps(product.tags),
            product.geologicalType,
            None if product.isMineral is None else int(product.isMineral),
            product.condition,
            product.safetyWarning,
            product.handlingWarning,
            10 if product.available else 0,
            1,
            "2026-01-01T00:00:00+00:00",
            1,
        ),
    )
    for carrier, services in product.shipping.items():
        connection.executemany(
            "INSERT INTO product_shipping_options (product_id, carrier, service) VALUES (?, ?, ?)",
            [(product.id, carrier, service) for service in services],
        )


if __name__ == "__main__":
    reset()
    print(f"Reset and seeded {database_path()}")

