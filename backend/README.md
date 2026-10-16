# MJ's Rock Shop API

This directory contains the Python API and local SQLite database for the expanded application.

## Requirements

- Python 3.11 or newer

## Install dependencies

From the `backend` directory, install the application and test dependencies with:

```bash
python -m pip install -e .
```

No virtual environment is required for this classroom project.

Testing packages remain available as an optional project extra for later student exercises:

```bash
python -m pip install -e ".[test]"
```

## Start the API

From the `backend` directory, run:

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Interactive documentation is available at `/docs`.

The same command can be run from the repository root with:

```bash
python -m uvicorn app.main:app --reload --app-dir backend
```

## Database setup

The application uses SQLite, a file-based database that does not require a separate database server. The default database file is:

```text
backend/data/rock_shop.db
```

The API creates and seeds the database automatically when it first needs it. To reset the database to the deterministic classroom data, run from the `backend` directory:

```bash
python -m app.database
```

The `ROCK_SHOP_DB_PATH` environment variable can point to a different database file for local experiments or tests.

## Service and adapter layers

Business rules are separated from the API routes in `app/services/`:

- `CatalogService` handles search, filtering, sorting, and availability rules.
- `PricingService` calculates item and order totals.
- `ShippingService` determines eligible fictional shipping options.
- `ScenarioService` maps fictional inputs to repeatable outcomes.

Interfaces for payment, shipping, and message services are in `app/adapters/protocols.py`. The local implementations in `app/adapters/local.py` do not contact real services or retain complete card numbers.

## Health check

```text
GET http://127.0.0.1:8000/api/health
```

The health response reports the API and SQLite database status. A healthy response includes `"database": {"status": "healthy"}`.

## Catalog endpoints

The SQLite-backed catalog is available through:

```text
GET /api/products
GET /api/products/{product_id}
```

The collection endpoint supports `search`, `color`, `geologicalType`, `mineralStatus`, `condition`, `sort`, and `availableOnly` query parameters.

## Order endpoints

Checkout uses these API endpoints:

```text
POST /api/orders/quote
POST /api/orders
GET /api/orders/{order_id}
```

Orders are stored with item snapshots and safe mock payment references. Complete card numbers are used only for the request and are never stored.

## Contact endpoint

The contact and interest forms use:

```text
POST /api/contact-messages
```

Messages are validated and stored in SQLite. The local message adapter records the submission without sending email.

No automated tests are included in this template. Students add their own checks as part of the course exercises.

## API error format

Errors use this JSON shape:

```json
{
  "error": {
    "code": "not_found",
    "message": "The requested resource was not found.",
    "fields": []
  }
}
```

The HTTP status code carries the overall result. The short error code and human-readable message support automation and classroom debugging. Validation errors include field-level details in `fields`.

