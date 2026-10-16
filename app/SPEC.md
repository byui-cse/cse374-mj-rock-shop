# MJ's Rock Shop — Version 1 Specification

## 1. Purpose

Build a small, customer-facing teaching prototype for MJ's Rock Shop. The site will let students practice testing product discovery, forms, validation, checkout steps, error handling, accessibility, and realistic success/failure scenarios.

This version is a vanilla HTML/CSS/JavaScript application. It will run entirely in the browser. External payment, shipping, messaging, and contact-storage services will be represented by deterministic mock behavior; no real customer data or card data will be transmitted or stored.

## 2. Version 1 goals

- Help customers discover a small catalog of fictional rock and mineral products.
- Support both ordinary-language discovery and geology-focused discovery.
- Show product characteristics and only display known facts.
- Surface safety and physical-handling warnings when the sample data contains them.
- Provide a contact form and a customer-interest/contact-information form.
- Demonstrate a short checkout flow with mock payment and shipping outcomes.
- Give students clear, repeatable states to test, including empty results, validation errors, payment declines, and unavailable shipping.

## 3. Out of scope

- Real payment processing or storage of card information.
- Real email, SMS, CRM, database, inventory, authentication, or admin tools.
- Live USPS or UPS rates, labels, tracking, or carrier APIs.
- Production security, deployment, analytics, or account creation.
- A large catalog or complete e-commerce back office.

## 4. Proposed project structure

```text
mj-rock-shop/
├── index.html              # Home/product discovery page
├── product.html            # Product detail page
├── checkout.html           # Checkout and mock payment/shipping flow
├── contact.html            # Contact and customer-interest form
├── css/
│   └── styles.css
├── js/
│   ├── data.js             # Built-in product and mock-service data
│   ├── app.js              # Shared navigation and rendering helpers
│   ├── catalog.js          # Search, sorting, filtering, and product details
│   ├── checkout.js         # Checkout state, validation, and mock outcomes
│   └── contact.js          # Contact form validation and mock submission
└── assets/
    └── products/           # Local fictional product images
```

The exact file split may be adjusted during implementation if a simpler structure improves readability for students, but the behavior and traceability in this document should remain.

## 5. User experience

### 5.1 Visual design and color palette

Use the [Coolors palette](https://coolors.co/palette/ffd9da-ea638c-89023e-30343f-1b2021) throughout the application:

| Color | Hex | Intended use |
|---|---|---|
| Light pink | `#FFD9DA` | Page backgrounds, soft panels, and subtle highlights |
| Pink | `#EA638C` | Secondary accents, badges, hover states, and decorative elements |
| Deep berry | `#89023E` | Primary buttons, links, headings, and active navigation states |
| Slate | `#30343F` | Secondary text, borders, and supporting UI elements |
| Near black | `#1B2021` | Main body text and high-emphasis content |

Use the palette consistently across all pages. Keep body text and controls readable against their backgrounds, preserve visible keyboard focus styles, and do not rely on color alone to communicate errors, warnings, availability, or selected filters. Pair color with text, icons, borders, or other visual cues. Verify contrast during implementation, especially for pink text and light-pink backgrounds.

### 5.2 Shared layout

- Use a consistent header with the MJ's Rock Shop name and navigation links for Shop, Contact, and Cart/Checkout.
- Use a visible page heading, readable labels, clear buttons, and a consistent footer.
- Use responsive layouts that work on desktop and narrow screens.
- Use semantic HTML, keyboard-accessible controls, visible focus styles, sufficient contrast, and meaningful image alternative text.
- Display status and error messages near the action that caused them, in plain language, with the next step when useful.

### 5.3 Shop/catalog page

- Show a featured/popular section when products are marked popular.
- Always provide access to the complete catalog, including when no products are marked popular.
- Show product cards with image, name, short description, price, availability, and a link/button for details.
- Provide:
  - Ordinary-language search across name, description, color, and tags.
  - Technical filters for geological type, mineral status, raw/polished condition, and color.
  - Sorting by name, price, and popularity.
  - A clear result count and a no-matches message.
- Include a deliberate empty-catalog state in the data/rendering logic so students can test the BRD behavior when no products exist.

### 5.4 Product detail page

- Display the product image, name, price, availability, description, and purchase action.
- Display known characteristics: color, geological type, mineral status, condition, and any other useful sample attributes.
- For unknown values, show “Unknown” or “Not provided”; do not turn missing data into a factual claim.
- Display safety warnings only when the product data contains a safety concern.
- Display physical-handling warnings for recorded cracks, fragility, or similar concerns only when present.
- Include a clear “Buy” action and a path back to the catalog.

### 5.5 Contact page

Provide two clearly labeled purposes within one page or two clearly separated forms:

1. Contact MJ: name, email, message, and optional subject.
2. Share customer interests: name, email, and interest/experience topic.

Requirements:

- Labels must be associated with every field.
- Required fields must be validated before submission.
- Missing or invalid information must produce an actionable message.
- A successful submission must show a confirmation that the mock message/contact record was accepted.
- The UI must make clear that this is a prototype and submissions are not sent to a real business.
- The mock contact record should be held only in memory or browser session state and should not use real personal information.

### 5.6 Checkout page

Use a visible, simple sequence:

1. Review selected product and price.
2. Enter customer and shipping information.
3. Choose a mock carrier/service when eligible: USPS or UPS, with Ground or Priority options as appropriate.
4. Enter mock card details.
5. Review and submit payment.
6. Show success or failure result.

Requirements:

- Show the current step and provide clear next/back actions.
- Validate required checkout fields and explain what is missing.
- Never save or display a complete card number after submission; use safe mock values and a masked display.
- Use deterministic test inputs or a visible “scenario” selector so students can reproduce outcomes:
  - Successful payment.
  - Invalid payment information.
  - Declined payment.
  - No available shipping option.
  - Successful shipping selection with an expected delivery message.
- For a successful eligible shipment, display an expected timeframe of “generally within one week,” clearly labeled as an estimate rather than a guarantee.
- Do not offer a carrier/service that the mock package data marks as ineligible.
- Show a clear confirmation with a mock order number after a successful purchase.

## 6. Sample catalog data

Include approximately 6–8 fictional products that provide varied test coverage. The set should include:

- Multiple colors, including at least one product searchable by “pink.”
- Igneous, sedimentary, and metamorphic examples where practical.
- Both minerals and non-mineral rock specimens.
- Raw and polished specimens.
- At least one unknown color, type, mineral status, or condition.
- At least one safety warning.
- At least one crack/fragility or other physical-handling warning.
- At least two popular products and at least one unavailable product.
- Different prices and shipping eligibility so sorting and checkout scenarios vary.

Use fictional product names and local images. Image alt text should identify the specimen and, where useful, its presentation (for example, “polished purple amethyst specimen”).

## 7. Mock behavior and data rules

- Keep catalog data in a readable JavaScript data module so students can inspect and extend it.
- Keep mock results deterministic; the same input should produce the same outcome.
- Use simple documented trigger values for payment and shipping failure scenarios rather than random failures.
- Use URL parameters or session state to identify the selected product and preserve the checkout demonstration across pages.
- Treat all forms as simulated. Do not submit to a network endpoint.
- Reset or clear demo state through a visible action where useful.

## 8. BRD traceability

| BRD requirements | Version 1 coverage |
|---|---|
| REQ-01–03 | Catalog page, featured products, product cards, detail page, empty-catalog state |
| REQ-04–05 | Search, sorting, and filters for ordinary and technical characteristics |
| REQ-06–09 | Product data fields with explicit unknown values |
| REQ-10 and REQ-20 | Conditional safety and physical-handling warnings |
| REQ-11–13 | Contact and customer-interest forms with validation and mock confirmation |
| REQ-14 | Multi-step checkout with review, validation, and confirmation |
| REQ-15–16 | Mock card validation, success, invalid, and declined payment states; no real provider |
| REQ-17–18 | Mock USPS/UPS and Ground/Priority options with eligibility rules |
| REQ-19 | Non-guaranteed “generally within one week” estimate when mock data supports it |

The BRD's usability, accessibility, performance, security, and privacy expectations apply to every page. Since this is a browser-only prototype, performance should be verified informally in a normal browser, while production security and privacy controls remain out of scope.

## 9. Testing targets

Students should be able to test at least these scenarios:

- Open the shop and see products plus featured products.
- Open a product detail page from a product card.
- Search for “pink” and receive matching results.
- Apply a technical filter and receive matching results.
- Combine filters/search and receive no results.
- Clear filters and return to the complete catalog.
- View known and unknown product characteristics.
- Confirm that warning text appears only for products with warning data.
- Submit contact forms with missing fields and with valid fields.
- Complete checkout successfully with an eligible shipping service.
- Attempt checkout with missing shipping/payment information.
- Trigger invalid and declined payment results.
- Trigger an unavailable-shipping result.
- Verify that a complete card number is not retained in the page after submission.
- Navigate the site with a keyboard and identify form fields using labels.
- Resize the page and confirm the layout remains usable.

## 10. Implementation sequence

1. Create the page structure, shared navigation, and accessible visual foundation.
2. Add local product images and the catalog data model.
3. Implement catalog rendering, featured products, detail views, search, sorting, filtering, and empty states.
4. Implement contact and customer-interest forms with mock submission behavior.
5. Implement checkout steps, shipping eligibility, mock payment outcomes, and order confirmation.
6. Add explicit demo controls or documented trigger data for repeatable success/failure testing.
7. Test the scenarios in Section 9, then fix accessibility, validation, and responsive-layout issues.

## 11. Definition of done for Version 1

- All BRD requirements are represented by a working prototype behavior or a clearly labeled mock behavior.
- The catalog contains enough varied sample data to exercise search, filters, unknown values, and warnings.
- Contact and checkout forms have success, validation-error, and relevant failure states.
- No real external service is called and no complete card number is stored.
- Pages are keyboard usable, forms have associated labels, images have meaningful alt text, and contrast is readable.
- A student can run the site locally by opening the main HTML page or using a simple static file server.
- The scenarios in Section 9 can be repeated reliably.
