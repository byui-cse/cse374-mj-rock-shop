# MJ's Rock Shop — Version 1 Implementation Plan

## 1. Implementation approach

Build the prototype in small vertical slices so each major user journey becomes testable as soon as it exists:

1. Establish the shared visual and accessibility foundation.
2. Add catalog data and product imagery.
3. Build product discovery and product details.
4. Build contact and customer-interest communication.
5. Build the mock checkout journey.
6. Run the defined test scenarios and polish the application.

The implementation will use only HTML, CSS, and browser JavaScript. No build tool, framework, server, external API, network form submission, or third-party payment library is required.

## 2. Phase 0 — Prepare the application workspace

### Tasks

- Create the directory structure described in `SPEC.md`.
- Create the four HTML entry points: `index.html`, `product.html`, `contact.html`, and `checkout.html`.
- Create `css/styles.css` and the JavaScript modules listed in the specification.
- Create `assets/products/` and add local fictional product images.
- Confirm that the pages can be opened directly from the file system or served by a simple static server.

### Verification

- Every navigation link points to an existing page.
- Each page has a meaningful title, one primary page heading, and the shared navigation/footer.
- No page depends on an external service to render.

## 3. Phase 1 — Establish the shared design system

### Tasks

- Define CSS custom properties for the Coolors palette:
  - `#FFD9DA` light pink for backgrounds and soft panels.
  - `#EA638C` pink for accents and secondary states.
  - `#89023E` deep berry for primary actions, links, and active states.
  - `#30343F` slate for borders and supporting text.
  - `#1B2021` near black for primary text.
- Create shared styles for page layout, header, navigation, buttons, cards, forms, alerts, badges, tables, and responsive grids.
- Add visible `:focus` styles for links, buttons, inputs, selects, and other controls.
- Define separate visual treatments for success, error, warning, information, unavailable, and selected states. Each state must include text or another non-color cue.
- Add responsive breakpoints for narrow screens.
- Use semantic landmarks such as `header`, `nav`, `main`, and `footer`.

### Verification

- Navigate the shared layout using only the keyboard.
- Confirm readable text contrast, especially combinations involving pink and light pink.
- Confirm that the layout remains usable at a narrow viewport.
- Confirm that error and warning styles are understandable without color perception.

## 4. Phase 2 — Create the catalog data model and assets

### Tasks

- Define a `products` array in `js/data.js`.
- Give every product a stable ID and these fields where applicable:
  - Name, description, price, image path, image alt text, availability, and popularity.
  - Search tags and color.
  - Geological type and mineral status.
  - Raw/polished condition.
  - Safety warning and physical-handling warning.
  - Shipping eligibility and supported carrier/services.
- Create 6–8 fictional products with deliberately varied data.
- Include the required test fixtures:
  - A pink-search match.
  - Igneous, sedimentary, and metamorphic examples where practical.
  - Mineral and non-mineral examples.
  - Raw and polished examples.
  - At least one unknown characteristic.
  - At least one safety warning and one physical-handling warning.
  - At least two popular products, one unavailable product, and varied prices/shipping rules.
- Add image files with meaningful alt text and reasonable dimensions/file sizes.
- Define documented mock checkout trigger values in the data module or a nearby comment, including success, invalid payment, declined payment, and unavailable shipping scenarios.

### Verification

- Inspect the data and confirm every required testing variation exists.
- Confirm missing values are represented as missing or explicitly unknown, not guessed.
- Confirm all image paths resolve and all images have useful alt text.

## 5. Phase 3 — Build the catalog and product discovery

### Tasks

- In `js/app.js`, add shared helpers for reading URL parameters, formatting prices, rendering status messages, and safely finding products by ID.
- In `js/catalog.js`, implement:
  - Catalog rendering from the data array.
  - Featured/popular product rendering.
  - Search across product name, description, color, and tags.
  - Filters for color, geological type, mineral status, and condition.
  - Sorting by name, price, and popularity.
  - Result count and no-results messaging.
  - Clear/reset controls.
  - Empty-catalog rendering when the product collection has no records.
- Render accessible product cards with heading structure, image alt text, price, availability, and a details link.
- Pass a selected product ID through the product-detail URL.
- On `product.html`, render the selected product and handle an invalid or missing product ID with a useful message and a link back to the shop.
- Render known characteristics and explicit unknown values.
- Render safety and physical-handling warnings only when corresponding data exists.
- Link the purchase action to checkout with the selected product ID.

### Verification

- Open the catalog with products and confirm featured products appear.
- Temporarily use an empty product array and confirm the empty state appears.
- Search for `pink`, apply each technical filter, sort results, combine controls, and clear them.
- Open valid and invalid product-detail URLs.
- Check that warnings do not appear on products without warning data.
- Confirm an unavailable product cannot be purchased, or receives a clear unavailable message.

## 6. Phase 4 — Build contact and customer-interest communication

### Tasks

- Build two clearly separated forms on `contact.html`:
  - Contact MJ: name, email, optional subject, message.
  - Share interests: name, email, interest/experience topic.
- Associate every label with its form control and use appropriate input types.
- Add required-field and email-format validation.
- Add inline error messages and an error summary or focus behavior that helps the user correct the form.
- Prevent network submission with `preventDefault()`.
- Store only a mock record in memory or `sessionStorage`, using clearly fictional demo data.
- Display a success confirmation after valid submission.
- State that the form is a prototype and does not contact a real business.
- Add a reset/clear action for repeatable classroom testing.

### Verification

- Submit each form with all required values missing.
- Submit with an invalid email address.
- Submit valid values and confirm the success message.
- Confirm the submitted interest/topic is represented in the mock record.
- Confirm no network request is made and no real personal data is required.
- Confirm keyboard users can identify errors and move to the affected fields.

## 7. Phase 5 — Build the mock checkout flow

### Tasks

- Read the product ID from the checkout URL and render a review step.
- Handle missing, unavailable, or invalid products with a clear recovery path.
- Implement a visible step indicator for:
  1. Review.
  2. Customer/shipping information.
  3. Shipping selection.
  4. Payment.
  5. Confirmation.
- Add shipping fields and required validation.
- Derive eligible USPS/UPS Ground/Priority options from the selected product's mock shipping data.
- Add a no-shipping-available state.
- Add payment fields designed for test values, with guidance that only fictional values should be entered.
- Validate card-format requirements without storing a complete card number.
- Implement deterministic mock outcomes:
  - Valid test input produces success.
  - Invalid-format input produces a validation error.
  - A documented decline trigger produces a declined-payment message.
  - A documented shipping trigger or product rule produces an unavailable-shipping message.
- Mask or discard payment information after submission.
- Show a mock order number and non-guaranteed one-week shipping estimate after success.
- Add a reset-demo action so students can repeat all scenarios.

### Verification

- Start checkout from a valid available product.
- Move backward and forward through the steps without losing valid state unexpectedly.
- Attempt to continue with each required field missing.
- Confirm only eligible carrier/service options are displayed.
- Complete a successful mock order.
- Trigger invalid payment, declined payment, and unavailable shipping.
- Inspect the DOM and session state to confirm a complete card number is not retained.
- Confirm the confirmation state clearly identifies the order as a mock/demo result.

## 8. Phase 6 — Cross-cutting quality pass

### Accessibility review

- Test all pages with keyboard-only navigation.
- Confirm logical tab order and visible focus.
- Confirm form labels, instructions, and error messages are available to assistive technology.
- Confirm images have meaningful alt text.
- Confirm headings and landmarks are structured logically.
- Confirm status messages use appropriate live-region behavior where needed.
- Recheck contrast for text, links, buttons, warnings, and focus indicators.

### Functional review

- Execute every scenario in Section 9 of `SPEC.md`.
- Test direct page loads, refreshes, missing URL parameters, and clearing/resetting state.
- Test unavailable products and no-result catalog states.
- Test the forms with both mouse and keyboard interaction.

### Responsive/performance review

- Test narrow, medium, and wide viewport sizes.
- Check that images are local and reasonably sized.
- Confirm catalog and detail pages render promptly in a normal browser.
- Confirm search/filter results update promptly after submission or control changes.

### Privacy/safety review

- Confirm there are no real API endpoints or external form actions.
- Confirm no complete card number is saved in HTML, JavaScript state after submission, or browser storage.
- Confirm all product warnings come from data and are not invented by the UI.
- Confirm demo copy tells users not to enter real personal or payment information.

## 9. Suggested implementation order and checkpoints

| Checkpoint | Deliverable | Review question |
|---|---|---|
| 1 | Shared pages and styling | Can a user navigate every page and understand the visual hierarchy? |
| 2 | Catalog data and images | Does the data support every required classroom test scenario? |
| 3 | Catalog and product details | Can users discover, filter, inspect, and select products? |
| 4 | Contact forms | Are validation and mock confirmations clear and repeatable? |
| 5 | Checkout | Can students reproduce success and each planned failure state? |
| 6 | Quality pass | Are accessibility, privacy, responsive layout, and BRD behaviors acceptable? |

Do not move to the next checkpoint until the current checkpoint can be opened and tested independently.

## 10. Final handoff checklist

- [ ] All files in the structure in `SPEC.md` exist and load correctly.
- [ ] The Coolors palette is implemented through shared CSS variables.
- [ ] The catalog contains 6–8 fictional products and local images.
- [ ] Search, sorting, filtering, featured products, empty states, and detail pages work.
- [ ] Known and unknown characteristics render correctly.
- [ ] Safety and physical-handling warnings are conditional.
- [ ] Contact and customer-interest forms validate and mock-submit.
- [ ] Checkout supports eligible USPS/UPS and Ground/Priority options.
- [ ] Checkout demonstrates success, invalid payment, declined payment, and unavailable shipping.
- [ ] No external integration or real data submission occurs.
- [ ] No complete card number is retained after submission.
- [ ] Keyboard, contrast, labels, alt text, responsive layout, and error messaging have been reviewed.
- [ ] The Section 9 test scenarios in `SPEC.md` can be repeated reliably.
