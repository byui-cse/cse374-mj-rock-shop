# MJ's Rock Shop Expansion Plan

## Purpose

Expand the current browser-only Rock Shop into a small, multi-tier teaching application that supports the CSE 374 Weeks 7–13 outline.

The expanded application should remain small enough for students to understand, deterministic enough for repeatable testing, and realistic enough to provide meaningful unit, integration, API, end-to-end, database, performance, CI/CD, static analysis, observability, and AI-assisted testing opportunities.

This document is a plan for review. It does not authorize implementation of the expansion yet.

## Design Goals

The expanded application should:

- Preserve the current customer experience and Rock Shop project context.
- Keep all payment, shipping, and contact services fictional and deterministic.
- Give students clear seams between the browser, API, business logic, and database.
- Support the testing pyramid instead of requiring every test to run through the browser.
- Include deliberate success, validation-error, unavailable, declined, and data-integrity scenarios.
- Make test data easy to reset and seed.
- Be simple enough to run locally with a short setup process.
- Avoid collecting real personal information or payment information.

## Proposed Architecture

```text
Browser UI
  HTML/CSS/JavaScript
  Catalog, product details, contact, checkout
        |
        | HTTP/JSON
        v
Python Web API
  Routes/controllers
  Request validation
  Service/business rules
  Deterministic mock service adapters
        |
        +--------------------+
        |                    |
        v                    v
Repository/Data Layer    Mock External Services
  SQLite for local use     Payment adapter
  PostgreSQL-compatible     Shipping adapter
  schema and seed data      Contact/message adapter
        |
        v
Database
  Products, orders, order items,
  contact messages, test/demo data
```

### Tier 1: Browser Presentation

Keep the existing pages and visual design:

- `index.html` for catalog discovery.
- `product.html` for product details.
- `checkout.html` for the checkout workflow.
- `contact.html` for contact and interest forms.
- Existing JavaScript modules for rendering and browser interaction.

Change the browser code so that product data, checkout results, and contact submissions come from the API instead of only from `js/data.js`.

The browser should still show clear loading, success, validation, unavailable, and error states. It should not contain the authoritative business rules for price, inventory, shipping eligibility, or order creation.

### Tier 2: Python Web API

Use a small Python framework such as FastAPI. FastAPI is a good teaching choice because it provides clear route definitions, JSON validation, interactive API documentation, and convenient testing support.

Suggested routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Report whether the service is running and the database is reachable. |
| `GET` | `/api/products` | Return available products with filtering, searching, and sorting parameters. |
| `GET` | `/api/products/{product_id}` | Return one product or a clear not-found response. |
| `POST` | `/api/contact-messages` | Validate and store a fictional contact message. |
| `POST` | `/api/orders/quote` | Validate a product and return price and eligible shipping options. |
| `POST` | `/api/orders` | Validate an order, call the deterministic mock payment/shipping adapters, and create an order. |
| `GET` | `/api/orders/{order_id}` | Return a safe order confirmation without exposing payment data. |
| `GET` | `/api/test-scenarios` | Optional classroom-only endpoint that documents available deterministic demo triggers. |

The API should return consistent JSON shapes for success and error responses. Each error should include an HTTP status code, a short error code, a human-readable message, and field details when appropriate.

### Tier 3: Service and Business Logic

Keep business rules in Python service functions or classes that do not depend directly on HTTP or the browser. Suggested services include:

- `CatalogService` for search, filtering, sorting, and availability rules.
- `PricingService` for item totals, discounts if added later, and order totals.
- `ShippingService` for carrier/service eligibility and estimated delivery text.
- `OrderService` for validation, inventory checks, payment coordination, and order creation.
- `ContactService` for validating and storing fictional messages.
- `ScenarioService` for deterministic success, decline, invalid, and unavailable outcomes.

This layer is the primary unit-test target. Students should be able to test important rules without starting a web server or browser.

### Tier 4: Repository and Database Access

Use a repository layer so services do not contain raw SQL everywhere. Suggested repositories include:

- `ProductRepository`
- `OrderRepository`
- `ContactMessageRepository`

Use SQLite for local development and classroom exercises. Keep the schema compatible with PostgreSQL so the course can introduce a production-style database without changing the application design.

Suggested tables:

- `products`
- `product_shipping_options`
- `orders`
- `order_items`
- `contact_messages`
- `test_scenarios` or a configuration table if scenario data is stored in the database

The database should enforce useful constraints such as positive prices, valid product IDs, nonnegative inventory, required order fields, and foreign-key relationships.

### Tier 5: Deterministic External-Service Adapters

Create interfaces and local adapters for services that would normally be external:

- `PaymentGateway` with approved, invalid, and declined outcomes.
- `ShippingGateway` with eligible and unavailable service outcomes.
- `MessageGateway` that records a fictional contact message without sending email.

The default classroom adapter should be deterministic and local. Students can replace it with a stub or mock during tests without changing the order service.

## Proposed Data and Behavior Changes

Move the current product data from `js/data.js` into database seed data. Preserve the existing six products and their useful variations:

- Available and unavailable products.
- Popular and non-popular products.
- Different prices.
- Multiple colors and geological types.
- Mineral and non-mineral specimens.
- Raw and polished conditions.
- Known and unknown values.
- Safety and handling warnings.
- Different shipping eligibility.

Add a small number of fields that create realistic multi-tier behavior:

- `inventory_quantity`
- `active`
- `updated_at`
- `version` or another simple concurrency field

Add order behavior that can be tested across layers:

1. The browser requests a product and displays current API data.
2. The API validates the order request.
3. The service checks product availability and inventory.
4. The service calculates the total and eligible shipping options.
5. The payment adapter returns a deterministic result.
6. The repository creates an order and order items in one transaction.
7. The API returns a safe confirmation with a mock order number.

Do not store complete card numbers. Store only a safe test reference such as a scenario name or last-four placeholder.

## Teaching and Testing Opportunities by Week

### Week 7: Pytest, Coverage, and the Testing Pyramid

Introduce the new project structure and show students how the same Rock Shop behavior can be tested at different levels.

Practice targets:

- Unit-test pricing, search, validation, shipping eligibility, and order rules.
- Use fixtures for a test product, test database, and deterministic service adapters.
- Use parameterized data for valid, boundary, and invalid quantities or prices.
- Run `pytest` and `pytest-cov`.
- Compare line and branch coverage for service code.
- Decide which tests belong at the unit, API/integration, and end-to-end levels.

The Week 7 group assignment can continue using a small practice application. The individual assignment can then apply the same structure to Rock Shop service functions.

### Week 8: Web Application Test Automation

Connect Playwright or Selenium to the browser and API-backed application.

Practice targets:

- Browse products loaded from the API.
- Search, filter, sort, and clear the catalog.
- Open a product detail page from an API result.
- Handle loading, empty, unavailable, and API-error states.
- Complete one successful checkout workflow.
- Use stable data attributes such as `data-testid` only where semantic locators are not sufficient.
- Use a Page Object Model for catalog and checkout pages.

Students should learn that browser tests verify a valuable user journey but are slower and more fragile than service-level tests.

### Week 9: API Testing and Automation

Use Python `requests`, Postman, or the FastAPI test client to test the API directly.

Practice targets:

- Product list and product-detail responses.
- Search, filter, and sort query parameters.
- Invalid product IDs and malformed requests.
- Order quote requests and shipping options.
- Successful, declined, and invalid payment scenarios.
- HTTP status codes, JSON response shapes, and schema validation.
- Authentication or an API key for a small admin-only endpoint if that feature is added.

API tests should cover behaviors more quickly and precisely than browser tests.

### Week 10: Data-Driven Testing and Database Validation

Use CSV or JSON files to drive scenario tests and SQL queries to verify stored results.

Practice targets:

- Parameterize product search terms and expected product IDs.
- Parameterize quantities, payment scenarios, and shipping scenarios.
- Verify that a successful order creates one order row and the correct order-item rows.
- Verify that a declined payment creates no completed order.
- Verify that unavailable products cannot be purchased.
- Verify that inventory changes correctly after a successful order.
- Verify that contact messages are stored with required fields and no sensitive data.
- Test transaction rollback when payment or database work fails.

Provide a reset-and-seed command so every student begins with the same data.

### Week 11: Performance Testing and System Quality

Use JMeter against the API and, if time allows, a small number of browser-level workflows.

Suggested workload:

- Many `GET /api/products` requests with common search and filter parameters.
- Product-detail requests for popular products.
- Order-quote requests using safe test data.
- A small number of complete mock orders using isolated test products or resettable data.

Measure and discuss:

- Response time at typical and peak concurrency.
- Throughput.
- Error rate.
- Database query time.
- Connection-pool or resource limits.
- Behavior when inventory is nearly exhausted.

Students should use Week 6 risk priorities to explain which performance results matter to Rock Shop users and the business.

### Week 12: CI/CD, Static Analysis, and Quality Gates

Create a GitHub Actions workflow that runs on pull requests and pushes.

Suggested pipeline stages:

1. Install Python and project dependencies.
2. Run JavaScript and Python formatting/lint checks.
3. Run static analysis such as Ruff, Bandit, and a JavaScript linter.
4. Run unit tests with coverage.
5. Start a temporary API and database, then run API integration tests.
6. Run a small smoke-level browser test suite.
7. Publish test and coverage results.

Possible quality gates:

- No lint or static-analysis errors.
- Unit and integration tests pass.
- A minimum coverage threshold for service code.
- API smoke tests pass.
- No critical security findings from the selected static-analysis tools.

Keep the full performance test and large browser suite out of every pull request. Run them on demand or on a scheduled workflow.

### Week 13: Quality Engineering, Cloud Concepts, Observability, and AI

Use the expanded application to discuss quality ownership across the whole system.

Observability opportunities:

- Structured logs for request method, route, status, duration, and request ID.
- Health checks for the API and database.
- Safe counters for API errors, order failures, and payment outcomes.
- Correlation of a browser action, API request, service decision, and database operation.
- No logging of complete card numbers, passwords, or unnecessary personal information.

Cloud-testing opportunities:

- Run the API and database in containers locally.
- Deploy a nonproduction environment to a student-accessible cloud service if approved.
- Test environment-specific configuration without changing application code.
- Compare local and hosted response times and failure behavior.

AI-assisted testing opportunities:

- Generate candidate test ideas from requirements and risk statements.
- Ask AI to identify missing boundary cases in a test-data file.
- Review AI-generated tests for incorrect assumptions and weak assertions.
- Compare AI-suggested tests with the Week 6 risk assessment.
- Use AI to summarize test results only after students verify the underlying evidence.

Students should evaluate whether each tool improves useful evidence, not merely whether it creates more output.

## Non-Functional Testing Plan

The expanded application should support the following non-functional testing areas from the course outline and existing Rock Shop specification.

### Performance

- Measure API response time, throughput, and error rate with JMeter.
- Test catalog search and product-detail endpoints under increasing load.
- Test order quotes separately from order creation so database-changing actions do not distort every run.
- Identify slow queries and compare results before and after an index is added.
- Document a small, realistic workload and explain what “fast enough” means for the prototype.

### Reliability and Resilience

- Restart the API and confirm the database data remains intact.
- Simulate payment-adapter failure and confirm the API returns a safe error.
- Simulate database timeout or unavailable database behavior.
- Confirm order transactions roll back instead of creating partial orders.
- Repeat the same deterministic scenario and compare results.
- Test whether retrying a request could create a duplicate order; add an idempotency key if the design needs one.

### Security and Privacy

- Validate and safely handle malformed JSON, unexpected IDs, and oversized input.
- Confirm product IDs and order IDs cannot expose unrelated records.
- Confirm complete card numbers are never stored or logged.
- Confirm contact and order data are not returned in unnecessary fields.
- Run Bandit or a comparable static-analysis tool on Python code.
- Add a simple authorization boundary for any administrative product or inventory route.
- Use fictional data only in student tests and demonstrations.

### Accessibility and Usability

- Continue keyboard, focus, label, heading, contrast, and screen-reader checks in the browser.
- Confirm API errors become understandable browser messages.
- Confirm loading and failure states are announced or visible to users.
- Test narrow and wide layouts after the browser becomes API-backed.
- Use an accessibility scanner as a supplement, not a replacement for human review.

### Maintainability and Code Quality

- Run formatters, linters, and static analysis in CI.
- Keep business rules in testable service functions instead of browser code or route handlers.
- Require clear names, small functions, and useful failure messages.
- Track coverage for important service modules, but review uncovered code by risk.
- Review dependency updates and keep configuration separate from source code.

### Compatibility

- Test the browser in at least two supported browsers.
- Test API behavior with valid and invalid JSON content types.
- Test the application with SQLite locally and a PostgreSQL-compatible environment if one is introduced.
- Test supported Python versions in CI if the course environment permits.

### Observability

- Include a request ID in API logs and error responses where appropriate.
- Record route duration and status without exposing private data.
- Provide `/api/health` and, if useful, `/api/ready` endpoints.
- Add a simple dashboard or report for request failures, order failures, and slow requests only if the teaching environment can support it.

## Suggested Repository Structure

```text
mj-rock-shop/
├── frontend/
│   ├── index.html
│   ├── product.html
│   ├── checkout.html
│   ├── contact.html
│   ├── css/
│   ├── js/
│   └── assets/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── adapters/
│   │   └── main.py
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── api/
│   ├── migrations/
│   ├── seed_data/
│   └── pyproject.toml
├── e2e/
├── performance/
├── .github/workflows/
└── README.md
```

The existing files can remain at the current root of `mj-rock-shop` during migration. The directory split is a target structure, not a requirement for the first implementation step.

## Phased Implementation Plan

### Phase 1: Preserve the Existing Prototype

- Add a simple local server for the current frontend.
- Capture current behavior with a small smoke-test checklist.
- Keep the current browser-only version available as a fallback or comparison point.
- Add stable selectors only where needed for browser automation.

### Phase 2: Add the API Without Changing the Database Yet

- Create the Python API and health endpoint.
- Add product-list and product-detail endpoints backed by seed data.
- Update the catalog and product pages to read from the API.
- Preserve the existing search, filter, sort, and warning behavior.

### Phase 3: Add SQLite and Repositories

- Create the schema and seed command.
- Move product data into the database.
- Add repository tests and database integration tests.
- Add reset-and-seed support for student exercises.

### Phase 4: Add Orders and Mock Adapters

- Move price, availability, shipping, and payment decisions into backend services.
- Add order and order-item tables.
- Add transaction handling and safe order confirmation.
- Update checkout to call the API.
- Preserve deterministic success, invalid, declined, and unavailable scenarios.

### Phase 5: Add Contact Storage and Error Handling

- Add the contact-message endpoint and table.
- Add validation and safe confirmation responses.
- Add consistent API error responses.
- Update the contact page to use the API.

### Phase 6: Build the Classroom Test Surface

- Add unit, API, integration, and end-to-end test examples.
- Add coverage configuration and a clear report command.
- Add test data factories and fixtures.
- Add a performance-test dataset that can be reset.
- Add logging, request IDs, and health checks.

### Phase 7: Add CI/CD and Non-Functional Checks

- Add formatting, linting, static analysis, unit tests, integration tests, and coverage to CI.
- Add a small browser smoke suite.
- Add scheduled or manually triggered performance tests.
- Document the quality gates and known limitations.

## Definition of Ready for Classroom Use

The expansion is ready for Weeks 7–13 when:

- A student can start the frontend, API, and database with documented commands.
- Product, contact, quote, and order behaviors are available through HTTP APIs.
- The database can be reset and seeded reliably.
- At least three meaningful unit-test modules exist.
- At least three API/integration workflows exist.
- At least three end-to-end workflows exist.
- Students can run a coverage report and identify meaningful untested behavior.
- A deterministic payment failure and a deterministic shipping failure are available.
- A database failure or transaction rollback scenario can be reproduced safely.
- JMeter can exercise read-heavy and write-limited workloads.
- CI runs tests and static analysis without real external services.
- Logs and error responses do not expose card data or unnecessary personal information.
- Existing accessibility and responsive behavior remain testable.

## Recommended Scope Control

Do not add real authentication, real payment processing, real email, live shipping APIs, customer accounts, or a production-grade admin system in the first expansion. Those features add complexity without improving the core Week 7–13 learning goals as much as clear local services, database transactions, deterministic adapters, and strong test seams would.
