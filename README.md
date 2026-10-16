# CSE 374 MJ Rock Shop

MJ's Rock Shop is a small multi-tier teaching application for the CSE 374 Software Testing course at BYU-Idaho. It gives students a realistic browser, API, service, repository, and database application to extend during the course.

All products, customers, payments, shipping, and messages are fictional. The application does not contact real payment, shipping, email, or inventory services.

## Run the expanded application

Requirements:

- Python 3.11 or newer
- A current Chrome, Edge, Firefox, or Safari browser with JavaScript and `fetch` support
- SQLite 3.35 or newer, provided through Python's standard library

Install backend dependencies from the repository root:

```bash
python -m pip install -e ./backend
```

Start the API in one terminal:

```bash
python -m uvicorn app.main:app --reload --app-dir backend
```

Start the frontend in a second terminal:

```bash
python -m http.server 8080 --directory app
```

Open <http://localhost:8080/>. The frontend uses port `8080`; the API uses port `8000`.

The API creates and seeds `backend/data/rock_shop.db` automatically. To reset it to the deterministic sample data:

```bash
python -m app.database
```

Run that command from the `backend` directory, or set `ROCK_SHOP_DB_PATH` when using a different local database file.

## Current features

- API-backed catalog search, filtering, sorting, and product details
- SQLite products, shipping options, orders, order items, and contact messages
- Multi-step API-backed checkout with quote and order creation
- Deterministic approved, invalid, declined, unavailable, and validation scenarios
- Fictional local payment, shipping, and message adapters
- Contact and customer-interest forms saved through the API
- Safe mock order confirmations without storing complete card numbers
- Responsive browser presentation with conditional warnings and unknown-value handling

## Fictional checkout values

Use fictional information only:

| Scenario | Card number |
| --- | --- |
| Successful payment | `4242 4242 4242 4242` |
| Declined payment | `4000 0000 0000 0002` |
| Invalid payment format | `1234` |

The remaining checkout fields can use other fictional values that satisfy the required-field and email-format rules.

## API overview

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check API and database availability. |
| `GET` | `/api/products` | Search and filter the catalog. |
| `GET` | `/api/products/{product_id}` | Retrieve one product. |
| `POST` | `/api/orders/quote` | Calculate a quote and eligible shipping options. |
| `POST` | `/api/orders` | Create a completed mock order. |
| `GET` | `/api/orders/{order_id}` | Retrieve a safe order confirmation. |
| `POST` | `/api/contact-messages` | Store a fictional message or interest record. |

Interactive API documentation is available at <http://127.0.0.1:8000/docs> while the backend is running.

## Project documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — How the application layers connect
- [STUDENT_GUIDE.md](STUDENT_GUIDE.md) — Setup, scope, and extension points
- [TASKS.md](TASKS.md) — Application migration milestones
- [app/README.md](app/README.md) — Frontend instructions
- [backend/README.md](backend/README.md) — API and database instructions

## Scope and safety

This is a classroom template, not a production shop. Do not add real payment processing, email delivery, live shipping calls, customer accounts, or real personal data without a separately approved design.

