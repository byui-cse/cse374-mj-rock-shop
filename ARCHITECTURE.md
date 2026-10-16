# Application Architecture

The expanded Rock Shop keeps each major responsibility in a separate layer. The browser communicates with the API; the API coordinates services; services use repositories and local adapters; repositories use SQLite.

```text
Browser UI :8080
  HTML, CSS, JavaScript
  catalog.js, checkout.js, contact.js
        |
        | HTTP/JSON with CORS for localhost:8080
        v
FastAPI API :8000
  routes.py
        |
        v
Business services
  CatalogService
  OrderService
  ContactService
  PricingService
  ShippingService
  ScenarioService
        |
        +-------------------------+
        |                         |
        v                         v
Repositories                  Local adapters
  ProductRepository            LocalPaymentGateway
  OrderRepository              LocalShippingGateway
  ContactMessageRepository     LocalMessageGateway
        |                         |
        +-------------+-----------+
                      v
                 SQLite database
                 backend/data/rock_shop.db
```

## Request flow examples

### Catalog

1. `catalog.js` requests `/api/products`.
2. The route opens a seeded database repository.
3. `CatalogService` applies search, filters, sorting, and availability rules.
4. The API returns JSON product data.
5. The browser renders cards and status messages.

### Checkout

1. `checkout.js` requests `/api/products/{product_id}`.
2. The browser requests `/api/orders/quote` before showing shipping choices.
3. `OrderService` checks product availability, inventory, price, and shipping eligibility.
4. The browser submits customer, shipping, and fictional payment data to `/api/orders`.
5. `LocalPaymentGateway` returns a deterministic result.
6. A successful order updates inventory and inserts an order plus order item in one transaction.
7. The API returns a safe confirmation without complete card data.

### Contact

1. `contact.js` sends a message or interest record to `/api/contact-messages`.
2. `ContactService` validates the record.
3. `LocalMessageGateway` records a fictional adapter receipt without sending email.
4. `ContactMessageRepository` stores the record in SQLite.

## Data ownership

- Browser code owns presentation state only.
- Services own business rules.
- Repositories own SQL and database mapping.
- Adapters own interactions with fictional external-service boundaries.
- SQLite owns persistent local records and constraints.

