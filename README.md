# MJ's Rock Shop

MJ's Rock Shop is a vanilla HTML, CSS, and JavaScript teaching prototype for practicing software testing. It represents a small online rock and mineral shop with product discovery, contact forms, and a simulated checkout process.

This application is intentionally designed for classroom use. It does not connect to real payment, shipping, email, database, or inventory services.

## Running the application

No build tools or dependencies are required.

### Option 1: Open the page directly

Open `index.html` in a modern web browser.

### Option 2: Use a local static server

From the `mj-rock-shop` directory, run a simple static server such as:

```text
python -m http.server
```

Then open the local address shown by the server, usually `http://localhost:8000`.

## Current features

- Responsive rock shop homepage and shared navigation
- Coolors-based visual palette
- Twelve fictional rock and mineral products
- Local specimen images
- Featured products
- Search by ordinary terms, names, colors, descriptions, and tags
- Filters for color, geological type, mineral status, and raw/polished condition
- Sorting by featured status, name, and price
- Product detail pages
- Explicit unknown product characteristics
- Conditional safety and physical-handling warnings
- Mock contact and customer-interest forms
- Form validation and temporary session-based mock records
- Multi-step mock checkout
- USPS and UPS shipping choices
- Ground and Priority shipping choices when eligible
- Mock payment success, invalid-input, decline, and unavailable-shipping states
- Mock order confirmation

## Mock checkout test values

Use fictional values only. Never enter real personal or payment information.

| Scenario | Card number |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Declined payment | `4000 0000 0000 0002` |
| Invalid payment format | `1234` |

The remaining checkout fields can use other fictional values that satisfy the required-field and email-format rules.

To test unavailable shipping, select a product whose data contains no eligible shipping services. The current catalog includes the unavailable Layered Sandstone product for related product-state testing.

## Project structure

```text
mj-rock-shop/
├── index.html              # Shop, featured products, search, filters, and sorting
├── product.html            # Product detail page
├── contact.html            # Contact and customer-interest forms
├── checkout.html           # Mock checkout flow
├── css/
│   └── styles.css          # Shared layout, palette, responsive, and accessibility styles
├── js/
│   ├── data.js             # Fictional products and mock checkout values
│   ├── app.js              # Shared browser helpers
│   ├── catalog.js          # Catalog and product-detail behavior
│   ├── contact.js          # Contact form behavior
│   └── checkout.js         # Checkout and mock payment/shipping behavior
└── assets/
    ├── hero-mj-rock-shop.png
    └── products/            # Local product images
```

## Testing focus

Students can practice testing:

- Product discovery and navigation
- Search, filtering, sorting, and no-result states
- Available and unavailable product behavior
- Known versus unknown product characteristics
- Conditional warning messages
- Required-field and email validation
- Keyboard navigation and visible focus states
- Responsive layout behavior
- Checkout step navigation
- Shipping eligibility
- Payment success, invalid input, and decline handling
- Protection against retaining complete card numbers

## Project documentation

- [SPEC.md](SPEC.md) — Version 1 requirements and behavior specification
- [PLAN.md](PLAN.md) — Phased implementation plan and verification checkpoints

## Important prototype limitations

- Product data is hard-coded in `js/data.js`.
- Contact submissions are stored only temporarily in browser session storage.
- Payment and shipping results are simulated locally.
- No card information is sent to a service or stored after payment handling.
- The application is not production-ready and should not receive real customer data.
