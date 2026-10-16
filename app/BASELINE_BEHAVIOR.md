# Baseline Behavior

This document records the behavior of the browser-only prototype before the multi-tier migration. It is a comparison reference for Milestone 1.

## Pages and navigation

| Page | Purpose | Important behavior |
| --- | --- | --- |
| `index.html` | Catalog discovery | Shows popular products, all available products, search, filters, sorting, result count, and an empty-results message. |
| `product.html?id=<product-id>` | Product details | Shows the selected product, price, characteristics, conditional warnings, and a purchase action when available. |
| `checkout.html?product=<product-id>` | Mock checkout | Guides a user through review, information, shipping, payment, and confirmation steps. |
| `contact.html` | Contact and interest forms | Validates two forms and stores fictional mock records in the browser session. |

The shared header links to Shop, Contact, and Checkout. Each page has a skip link, a primary heading, a main landmark, and a footer.

## Catalog behavior

- Product data comes from `app/js/data.js`.
- The prototype contains 12 products, including 11 available products and one unavailable product.
- Popular products appear in the Popular picks section.
- The available-product list excludes unavailable products.
- Search checks product name, description, color, and tags.
- Filters include color, geological type, mineral status, and condition.
- Sort options include Featured, Name A to Z, Price low to high, and Price high to low.
- Results update when a filter changes or the filter form is submitted.
- Clear filters restores the default selections and result list.
- A result count is announced through an `aria-live` region.
- No matching results display a message recommending that the user change or clear filters.
- Product cards provide detail links and a Buy link only when the product is available.

## Product-detail behavior

- A valid product ID is read from the `id` query parameter.
- A missing or invalid ID displays a Product not found message and a link back to the shop.
- A valid product displays its name, price, description, image, and characteristics.
- Unknown values are displayed as `Not recorded` rather than being guessed.
- Safety and handling warnings appear only when the product has those warnings.
- Available products provide a link to checkout.
- Unavailable products display an unavailable message instead of a purchase link.

## Checkout behavior

- Checkout reads the product ID from the `product` query parameter.
- Missing or invalid products display a recovery message and hide the checkout form.
- Unavailable products display a status message and hide the checkout form.
- The flow has five visible steps: Review, Information, Shipping, Payment, and Confirmation.
- Required customer and address fields are validated before moving to shipping.
- Shipping options are generated from the selected product's mock USPS and UPS data.
- A product with no eligible services displays an unavailable-shipping message.
- Payment accepts fictional test values only.
- `4242 4242 4242 4242` demonstrates approved payment.
- `4000 0000 0000 0002` demonstrates declined payment.
- Other non-16-digit values demonstrate payment validation errors.
- An approved payment displays a mock order number and confirmation.
- The complete card number is not saved by the prototype after the confirmation flow.

## Contact and interest behavior

- The Contact MJ form requires name, email, and message; subject is optional.
- The Share your rock interests form requires name, email, and interest text.
- Empty required fields and invalid email addresses display inline errors and focus the first invalid field.
- Valid submissions display a success message and clear the form.
- Mock records are stored in `sessionStorage` under `mjs-rock-shop-contact-records` when storage is available.
- The forms do not send network requests or contact a real business.

## Baseline accessibility and responsive behavior

- Keyboard users can reach the skip link, navigation, controls, forms, and buttons.
- Focus styles are provided by the shared stylesheet.
- Form controls have associated labels and field error descriptions.
- Status and result messages use live regions where appropriate.
- Product images include descriptive alternative text.
- The layout uses responsive grids and narrow-screen breakpoints.
- Warning, error, unavailable, and success states include text in addition to color.

