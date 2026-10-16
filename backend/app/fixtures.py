"""Small reusable classroom data examples for future application features."""

from app.models.catalog import CATALOG, CatalogProduct


def sample_product() -> CatalogProduct:
    """Return an independent copy of the first available sample product."""
    return CATALOG[0].model_copy(deep=True)


def unavailable_product() -> CatalogProduct:
    """Return an independent copy of the unavailable sample product."""
    return next(product.model_copy(deep=True) for product in CATALOG if not product.available)

