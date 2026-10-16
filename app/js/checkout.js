let checkoutProduct = null;
let currentQuote = null;
const checkoutProductId = new URLSearchParams(window.location.search).get("product");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutStatus = document.querySelector("#checkout-status");
const productSummary = document.querySelector("#checkout-product");
const confirmation = document.querySelector("#confirmation");

function showCheckoutStatus(message) {
  checkoutStatus.textContent = message;
  checkoutStatus.hidden = false;
}

function clearCheckoutStatus() {
  checkoutStatus.hidden = true;
  checkoutStatus.textContent = "";
}

async function loadCheckoutProduct() {
  if (!checkoutProductId) {
    renderInvalidProduct("This checkout page needs a valid available product.");
    return;
  }
  try {
    checkoutProduct = await apiFetch(`/api/products/${encodeURIComponent(checkoutProductId)}`);
    renderCheckoutProduct();
  } catch (error) {
    renderInvalidProduct(error.code === "product_not_found" ? "This checkout page needs a valid available product." : `${error.message} Try again after confirming the API is running.`);
  }
}

function renderInvalidProduct(message) {
  productSummary.innerHTML = `<div><h3>Choose a product first</h3><p>${escapeHTML(message)}</p><a class="button" href="index.html">Return to the shop</a></div>`;
  checkoutForm.hidden = true;
}

function renderCheckoutProduct() {
  productSummary.innerHTML = `<img src="${escapeHTML(checkoutProduct.image)}" alt="${escapeHTML(checkoutProduct.imageAlt)}"><div><h3>${escapeHTML(checkoutProduct.name)}</h3><p>${escapeHTML(checkoutProduct.description)}</p><p class="detail-price">${formatPrice(checkoutProduct.price)}</p>${checkoutProduct.available ? "" : `<p class="unavailable">This product is currently unavailable.</p>`}</div>`;
  if (!checkoutProduct.available) {
    checkoutForm.hidden = true;
    showCheckoutStatus("This product is unavailable. Return to the shop to choose an available product.");
  }
}

function updateStep(step) {
  document.querySelectorAll(".checkout-section").forEach((section) => {
    section.hidden = Number(section.dataset.section) !== step;
  });
  document.querySelectorAll(".steps li").forEach((item) => {
    item.classList.toggle("current", Number(item.dataset.step) === step);
  });
  clearCheckoutStatus();
  document.querySelector(`[data-section="${step}"] h3`)?.focus();
}

function clearFieldErrors() {
  checkoutForm.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; error.hidden = true; });
  checkoutForm.querySelectorAll(".input-error").forEach((input) => input.classList.remove("input-error"));
}

function validateFields(fields) {
  const invalid = [];
  fields.forEach((field) => {
    const error = document.querySelector(`#${field.id}-error`);
    let message = "";
    if (!field.value.trim()) message = "This field is required.";
    if (field.type === "email" && field.value.trim() && !field.validity.valid) message = "Enter an email address in a format like name@example.com.";
    if (message) {
      error.textContent = message;
      error.hidden = false;
      field.classList.add("input-error");
      invalid.push(field);
    }
  });
  if (invalid[0]) invalid[0].focus();
  return invalid.length === 0;
}

function validateInformation() {
  clearFieldErrors();
  return validateFields([...checkoutForm.querySelectorAll('[data-section="2"] [required]')]);
}

async function renderShippingOptions() {
  const container = document.querySelector("#shipping-options");
  container.innerHTML = `<p role="status">Loading eligible shipping options...</p>`;
  try {
    currentQuote = await apiFetch("/api/orders/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: checkoutProduct.id, quantity: 1 }),
    });
  } catch (error) {
    container.innerHTML = `<p class="form-status error" role="alert">${escapeHTML(error.message)}</p>`;
    return false;
  }
  const options = currentQuote.shipping_options;
  if (!options.length) {
    container.innerHTML = `<p class="unavailable">No USPS or UPS shipping option is available for this package.</p>`;
    return false;
  }
  container.innerHTML = options.map((option, index) => `<label class="radio-option"><input type="radio" name="shipping" value="${escapeHTML(`${option.carrier}-${option.service}`)}" ${index === 0 ? "checked" : ""}><span><strong>${escapeHTML(option.carrier)} ${escapeHTML(option.service)}</strong><br><small>Estimated delivery: ${escapeHTML(option.estimated_delivery)}</small></span></label>`).join("");
  return true;
}

function validatePayment() {
  clearFieldErrors();
  const fields = [...checkoutForm.querySelectorAll('[data-section="4"] [required]')];
  if (!validateFields(fields)) return false;
  const cardNumber = document.querySelector("#card-number").value.replaceAll(/\s/g, "");
  const cardError = document.querySelector("#card-number-error");
  if (!/^\d{16}$/.test(cardNumber)) {
    cardError.textContent = "Enter a 16-digit fictional test card number.";
    cardError.hidden = false;
    document.querySelector("#card-number").classList.add("input-error");
    document.querySelector("#card-number").focus();
    return false;
  }
  return true;
}

async function completePayment() {
  const selectedShipping = checkoutForm.querySelector('input[name="shipping"]:checked')?.value || "";
  const separator = selectedShipping.indexOf("-");
  const formData = new FormData(checkoutForm);
  const request = {
    product_id: checkoutProduct.id,
    quantity: 1,
    customer: {
      name: formData.get("name"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
    },
    shipping_carrier: separator >= 0 ? selectedShipping.slice(0, separator) : selectedShipping,
    shipping_service: separator >= 0 ? selectedShipping.slice(separator + 1) : "",
    card_number: formData.get("cardNumber"),
    card_name: formData.get("cardName"),
    expiry: formData.get("expiry"),
  };

  try {
    const order = await apiFetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    document.querySelectorAll(".checkout-section").forEach((section) => { section.hidden = true; });
    document.querySelectorAll(".steps li").forEach((item) => item.classList.toggle("current", Number(item.dataset.step) === 5));
    confirmation.innerHTML = `<h3 id="confirmation-heading">Mock payment approved</h3><p>Thank you for testing the MJ's Rock Shop checkout.</p><p><strong>Mock order:</strong> ${escapeHTML(order.order_number)}<br><strong>Item:</strong> ${escapeHTML(order.product_name)}<br><strong>Shipping:</strong> ${escapeHTML(`${order.shipping_carrier} ${order.shipping_service}`)}<br><strong>Expected timeframe:</strong> ${escapeHTML(order.expected_delivery)}, not a guarantee</p><p>Your complete card number was not saved.</p><a class="button" href="index.html">Return to the shop</a>`;
    confirmation.hidden = false;
    checkoutForm.reset();
    document.querySelector("#checkout-product").hidden = true;
  } catch (error) {
    showCheckoutStatus(error.message);
    document.querySelector("#card-number").value = "";
    document.querySelector("#card-expiry").value = "";
  }
}

document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", async () => {
  const nextStep = Number(button.dataset.next);
  if (nextStep === 3 && !validateInformation()) {
    showCheckoutStatus("Please correct the highlighted information before continuing.");
    return;
  }
  if (nextStep === 4) {
    const shippingOptionsAvailable = await renderShippingOptions();
    if (!shippingOptionsAvailable) {
      showCheckoutStatus("No shipping option could be provided for this package.");
      return;
    }
  }
  updateStep(nextStep);
}));

document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => updateStep(Number(button.dataset.back))));
checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validatePayment()) {
    showCheckoutStatus("Please correct the highlighted payment fields before submitting.");
    return;
  }
  await completePayment();
});

loadCheckoutProduct();

