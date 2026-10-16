"""Catalog filtering and sorting rules for the temporary catalog source."""

from collections.abc import Sequence

from app.models.catalog import CatalogProduct


def search_matches(product: CatalogProduct, search: str | None) -> bool:
    if not search:
        return True
    searchable = " ".join(
        value
        for value in [product.name, product.description, product.color, *product.tags]
        if value
    ).lower()
    return search.strip().lower() in searchable


def list_products(
    products: Sequence[CatalogProduct],
    *,
    search: str | None = None,
    color: str | None = None,
    geological_type: str | None = None,
    mineral_status: str | None = None,
    condition: str | None = None,
    sort: str = "featured",
    available_only: bool = True,
) -> list[CatalogProduct]:
    filtered = [
        product
        for product in products
        if (not available_only or product.available)
        and search_matches(product, search)
        and (not color or product.color == color)
        and (not geological_type or product.geologicalType == geological_type)
        and (
            not mineral_status
            or (mineral_status == "mineral" and product.isMineral is True)
            or (mineral_status == "rock" and product.isMineral is not True)
        )
        and (not condition or product.condition == condition)
    ]

    if sort == "name-asc":
        filtered.sort(key=lambda product: product.name.lower())
    elif sort == "price-asc":
        filtered.sort(key=lambda product: product.price)
    elif sort == "price-desc":
        filtered.sort(key=lambda product: product.price, reverse=True)
    else:
        filtered.sort(key=lambda product: product.popular, reverse=True)
    return filtered

