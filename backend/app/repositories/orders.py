"""Order persistence for the SQLite database."""

from __future__ import annotations

import sqlite3
from datetime import UTC, datetime
from decimal import Decimal

from app.models.orders import CustomerInformation, OrderConfirmation
from app.services.shipping import ShippingOption


class OrderRepository:
    """Persist orders and their item snapshots."""

    def __init__(self, connection: sqlite3.Connection):
        self.connection = connection

    def create_order(
        self,
        *,
        order_number: str,
        customer: CustomerInformation,
        product_id: str,
        product_name: str,
        quantity: int,
        unit_price: Decimal,
        total: Decimal,
        shipping: ShippingOption,
        payment_reference: str,
    ) -> OrderConfirmation:
        created_at = datetime.now(UTC).isoformat()
        cursor = self.connection.execute(
            """
            INSERT INTO orders (
                order_number, customer_name, customer_email, shipping_address,
                shipping_city, shipping_state, shipping_zip, shipping_carrier,
                shipping_service, subtotal, total, payment_reference, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order_number,
                customer.name,
                customer.email,
                customer.address,
                customer.city,
                customer.state,
                customer.zip,
                shipping.carrier,
                shipping.service,
                str(total),
                str(total),
                payment_reference,
                "completed",
                created_at,
            ),
        )
        order_id = cursor.lastrowid
        self.connection.execute(
            """
            INSERT INTO order_items (
                order_id, product_id, product_name, quantity, unit_price, line_total
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (order_id, product_id, product_name, quantity, str(unit_price), str(total)),
        )
        return OrderConfirmation(
            order_id=order_id,
            order_number=order_number,
            status="completed",
            product_id=product_id,
            product_name=product_name,
            quantity=quantity,
            total=float(total),
            shipping_carrier=shipping.carrier,
            shipping_service=shipping.service,
            expected_delivery=shipping.estimated_delivery,
            payment_reference=payment_reference,
        )

    def get_confirmation(self, order_id: int) -> OrderConfirmation | None:
        row = self.connection.execute(
            """
            SELECT o.id, o.order_number, o.status, o.total,
                   o.shipping_carrier, o.shipping_service,
                   oi.product_id, oi.product_name, oi.quantity,
                   o.payment_reference
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            WHERE o.id = ?
            ORDER BY oi.id
            LIMIT 1
            """,
            (order_id,),
        ).fetchone()
        if not row:
            return None
        return OrderConfirmation(
            order_id=row["id"],
            order_number=row["order_number"],
            status=row["status"],
            product_id=row["product_id"],
            product_name=row["product_name"],
            quantity=row["quantity"],
            total=float(row["total"]),
            shipping_carrier=row["shipping_carrier"],
            shipping_service=row["shipping_service"],
            expected_delivery="Generally within one week",
            payment_reference=row["payment_reference"],
        )

