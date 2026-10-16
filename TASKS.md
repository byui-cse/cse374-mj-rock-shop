# MJ Rock Shop Expansion Tasks

This document tracks the application work needed to migrate the browser prototype to the expanded, multi-tier application.

Students will add the automated checks and quality activities themselves as course exercises. This task list focuses on application behavior, architecture, data, and setup.

## Milestone 1: Baseline and migration preparation — complete

**Goal:** Preserve the current application and document its behavior before changing its data source.

- [x] Identify the current frontend entry points: `index.html`, `product.html`, `checkout.html`, and `contact.html`.
- [x] Document the current behavior of catalog search, filtering, sorting, product details, checkout, and contact forms.
- [x] Record the twelve baseline products and their important variations from `app/js/data.js`.
- [x] Record the current accessibility, responsive-layout, warning, and validation behavior.
- [x] Add or document a simple local server command for the existing frontend.
- [x] Preserve the browser-only application as a comparison point during migration.

**Exit criteria:** The current application can be started locally and its key behavior is documented.

## Milestone 2: Establish the backend project — complete

**Goal:** Add a small Python web API without changing the existing customer experience.

- [x] Choose and document FastAPI as the Python framework.
- [x] Create the backend structure for API routes, models, repositories, services, and adapters.
- [x] Add dependency management and document Python 3.11 or newer.
- [x] Implement `GET /api/health`.
- [x] Add consistent JSON response and error conventions.
- [x] Include an HTTP status, short error code, human-readable message, and field details where appropriate.
- [x] Add local development commands for starting the API.

**Exit criteria:** The API starts locally, reports its health, and returns predictable success and error responses.

## Milestone 3: Move catalog behavior behind the API — complete

**Goal:** Make the browser read product data from the API while preserving the current catalog experience.

- [x] Implement `GET /api/products`.
- [x] Support search, filtering, sorting, and availability parameters.
- [x] Implement `GET /api/products/{product_id}`.
- [x] Return a clear not-found response for an unknown product.
- [x] Create temporary seed data that preserves the current product catalog and product variations.
- [x] Update `app/js/catalog.js` to load catalog data from the API.
- [x] Update product-detail behavior to load data from the API.
- [x] Remove the catalog and product pages' dependence on `app/js/data.js`; checkout remains on the prototype data source until its migration milestone.
- [x] Implement loading, empty, unavailable, and API-error states in the browser.
- [x] Preserve product warnings and display details in API-backed product cards and details.

**Exit criteria:** Catalog and product pages use API data and preserve the current customer experience.

## Milestone 4: Add SQLite, schema, repositories, and reset support — complete

**Goal:** Replace the temporary catalog source with a resettable local database and a repository layer.

- [x] Create the SQLite schema for `products`.
- [x] Add `product_shipping_options` and the relationships needed for shipping eligibility.
- [x] Add inventory quantity, active status, updated timestamp, and a simple version/concurrency value.
- [x] Add database constraints for positive prices, nonnegative inventory, required fields, and valid foreign keys.
- [x] Create deterministic seed data for the existing products, including available/unavailable and shipping variations.
- [x] Add a reset-and-seed command that produces the same database state every time.
- [x] Implement `ProductRepository` without putting raw SQL throughout service code.
- [x] Add database connection and configurable path handling for local development.
- [x] Keep the schema compatible with PostgreSQL where practical.

**Exit criteria:** A student can reset and seed the database, start the API, and receive the same catalog data on every run.

## Milestone 5: Add business services and deterministic adapters

**Goal:** Move authoritative rules out of the browser and route handlers into independently reusable services.

- [ ] Implement `CatalogService` for search, filtering, sorting, and availability rules.
- [ ] Implement `PricingService` for item totals and order totals.
- [ ] Implement `ShippingService` for carrier/service eligibility and estimated delivery text.
- [ ] Define interfaces for `PaymentGateway`, `ShippingGateway`, and `MessageGateway`.
- [ ] Implement deterministic local adapters for approved, invalid, declined, eligible, unavailable, and message-recording outcomes.
- [ ] Implement `ScenarioService` or an equivalent mechanism for repeatable classroom scenarios.
- [ ] Keep service functions independent from HTTP, browser code, and database connection details.
- [ ] Add fixtures and sample data structures that students can use when creating their own course work.

**Exit criteria:** Core business rules are isolated from HTTP and browser code, and deterministic local adapters are available.

## Milestone 6: Implement quotes and orders

**Goal:** Provide an API-backed checkout flow with safe persistence and deterministic outcomes.

- [ ] Create tables for `orders` and `order_items`.
- [ ] Implement `OrderRepository`.
- [ ] Implement `POST /api/orders/quote`.
- [ ] Validate product, quantity, inventory, price, and eligible shipping options in the backend.
- [ ] Implement `POST /api/orders`.
- [ ] Coordinate validation, inventory, pricing, shipping, payment, and persistence through `OrderService`.
- [ ] Create orders and order items in one database transaction.
- [ ] Decrease inventory only after a successful order.
- [ ] Roll back order data when payment or database work fails.
- [ ] Support deterministic success, invalid-payment, declined-payment, unavailable-product, and unavailable-shipping scenarios.
- [ ] Store only a safe payment reference or last-four placeholder; never store complete card numbers.
- [ ] Return a safe confirmation with a mock order number.
- [ ] Implement `GET /api/orders/{order_id}` without exposing payment data.
- [ ] Update `app/js/checkout.js` to use quote and order endpoints.
- [ ] Add clear checkout loading, validation, success, unavailable, and error states.

**Exit criteria:** Successful checkout creates correct order records, and failure scenarios leave no partial completed order.

## Milestone 7: Add contact-message support

**Goal:** Move contact and interest forms to the API and store fictional messages safely.

- [ ] Create the `contact_messages` table.
- [ ] Implement `ContactMessageRepository`.
- [ ] Implement `POST /api/contact-messages`.
- [ ] Validate required fields, formats, and input size limits.
- [ ] Implement the local `MessageGateway` without sending real email.
- [ ] Update `app/js/contact.js` to submit through the API.
- [ ] Add success, validation-error, loading, and API-error states to the contact page.
- [ ] Store no unnecessary sensitive information in contact records.

**Exit criteria:** Contact submissions are validated, stored locally, confirmed safely, and available through the API.

## Milestone 8: Student extension handoff

**Goal:** Prepare the expanded application as a clean template for student exercises.

- [ ] Document frontend, API, database, seed, reset, and startup commands.
- [ ] Document the supported Python, browser, and database versions.
- [ ] Document the fictional data and deterministic scenario triggers.
- [ ] Document how the browser, API, service, repository, and database layers connect.
- [ ] Document the remaining student extension points without providing completed course solutions.
- [ ] Keep real authentication, payment, email, live shipping, customer accounts, and production administration out of scope.

**Exit criteria:** A student can install and run the expanded application locally and clearly identify where to add course work.

## Final application checklist

- [ ] Frontend, API, database, and service boundaries are clear.
- [ ] Existing catalog behavior and Rock Shop context are preserved.
- [ ] Product, contact, quote, and order functionality work through HTTP APIs.
- [ ] Database reset and seed operations are deterministic.
- [ ] Successful, validation-error, unavailable, declined, and rollback scenarios are reproducible.
- [ ] No real payment, shipping, email, or other external service is required.
- [ ] Logs and responses do not expose complete card numbers or unnecessary personal information.
- [ ] Accessibility and responsive behavior remain part of the application design.

