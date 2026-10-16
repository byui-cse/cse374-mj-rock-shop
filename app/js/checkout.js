const checkoutProduct = getProductById(new URLSearchParams(window.location.search).get("product"));
const checkoutForm = document.querySelector("#checkout-form");
const checkoutStatus = document.querySelector("#checkout-status");
const productSummary = document.querySelector("#checkout-product");
const confirmation = document.querySelector("#confirmation");
let currentStep = 1;

function showCheckoutStatus(message) {
  checkoutStatus.textContent = message;
  checkoutStatus.hidden = false;
}

function clearCheckoutStatus() {
  checkoutStatus.hidden = true;
  checkoutStatus.textContent = "";
}

function renderCheckoutProduct() {
  if (!checkoutProduct) {
    productSummary.innerHTML = `<div><h3>Choose a product first</h3><p>This checkout page needs a valid available product.</p><a class="button" href="index.html">Return to the shop</a></div>`;
    checkoutForm.hidden = true;
    return;
  }
  productSummary.innerHTML = `<img src="${escapeHTML(checkoutProduct.image)}" alt="${escapeHTML(checkoutProduct.imageAlt)}"><div><h3>${escapeHTML(checkoutProduct.name)}</h3><p>${escapeHTML(checkoutProduct.description)}</p><p class="detail-price">${formatPrice(checkoutProduct.price)}</p>${checkoutProduct.available ? "" : `<p class="unavailable">This product is currently unavailable.</p>`}</div>`;
  if (!checkoutProduct.available) {
    checkoutForm.hidden = true;
    showCheckoutStatus("This product is unavailable. Return to the shop to choose an available product.");
  }
}

function updateStep(step) {
  currentStep = step;
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

function renderShippingOptions() {
  const container = document.querySelector("#shipping-options");
  const options = Object.entries(checkoutProduct.shipping || {}).flatMap(([carrier, services]) => services.map((service) => ({ carrier, service })));
  if (!options.length) {
    container.innerHTML = `<p class="unavailable">No USPS or UPS shipping option is available for this package.</p>`;
    return false;
  }
  container.innerHTML = options.map((option, index) => `<label class="radio-option"><input type="radio" name="shipping" value="${escapeHTML(`${option.carrier}-${option.service}`)}" ${index === 0 ? "checked" : ""}><span><strong>${escapeHTML(option.carrier)} ${escapeHTML(option.service)}</strong><br><small>Estimated delivery: generally within one week</small></span></label>`).join("");
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

function completePayment() {
  const cardNumber = document.querySelector("#card-number").value.replaceAll(/\s/g, "");
  const declineNumber = mockCheckoutScenarios.declineCode.replaceAll(" ", "");
  if (cardNumber === declineNumber) {
    document.querySelector("#card-number").value = "";
    document.querySelector("#card-expiry").value = "";
    showCheckoutStatus("The mock payment provider declined this payment. Check the card details or use the success test number.");
    return;
  }
  const orderNumber = `MJ-${Math.floor(100000 + Math.random() * 900000)}`;
  const selectedShipping = checkoutForm.querySelector('input[name="shipping"]:checked')?.value.replace("-", " ") || "selected service";
  document.querySelectorAll(".checkout-section").forEach((section) => { section.hidden = true; });
  document.querySelectorAll(".steps li").forEach((item) => item.classList.toggle("current", Number(item.dataset.step) === 5));
  confirmation.innerHTML = `<h3 id="confirmation-heading">Mock payment approved</h3><p>Thank you for testing the MJ's Rock Shop checkout.</p><p><strong>Mock order:</strong> ${orderNumber}<br><strong>Item:</strong> ${escapeHTML(checkoutProduct.name)}<br><strong>Shipping:</strong> ${escapeHTML(selectedShipping)}<br><strong>Expected timeframe:</strong> generally within one week, not a guarantee</p><p>Your complete card number was not saved.</p><a class="button" href="index.html">Return to the shop</a>`;
  confirmation.hidden = false;
  checkoutForm.reset();
  document.querySelector("#checkout-product").hidden = true;
}

document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => {
  const nextStep = Number(button.dataset.next);
  if (nextStep === 3 && !validateInformation()) {
    showCheckoutStatus("Please correct the highlighted information before continuing.");
    return;
  }
  if (nextStep === 4) {
    const shippingOptionsAvailable = renderShippingOptions();
    if (!shippingOptionsAvailable) {
      showCheckoutStatus("No shipping option could be provided for this package.");
      return;
    }
  }
  updateStep(nextStep);
}));

document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => updateStep(Number(button.dataset.back))));
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validatePayment()) {
    showCheckoutStatus("Please correct the highlighted payment fields before submitting.");
    return;
  }
  completePayment();
});

renderCheckoutProduct();
