function productCard(product) {
  const availability = product.available
    ? `<span>Available</span>`
    : `<span class="unavailable">Currently unavailable</span>`;
  const popular = product.popular ? `<span class="badge">Popular pick</span>` : "";
  const purchaseAction = product.available
    ? `<a class="button" href="checkout.html?product=${encodeURIComponent(product.id)}">Buy</a>`
    : `<span class="button button-secondary" aria-disabled="true">Unavailable</span>`;

  return `<article class="product-card" data-product-id="${escapeHTML(product.id)}">
    <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.imageAlt)}">
    <div class="product-card-content">
      ${popular}
      <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${escapeHTML(product.name)}</a></h3>
      <p class="price">${formatPrice(product.price)}</p>
      <p>${escapeHTML(product.description)}</p>
      <p>${availability}</p>
      <div class="button-row">
        <a class="button button-secondary" href="product.html?id=${encodeURIComponent(product.id)}">View details</a>
        ${purchaseAction}
      </div>
    </div>
  </article>`;
}

function renderCards(list, container) {
  container.innerHTML = list.map(productCard).join("");
}

function populateColorOptions(products) {
  const colorSelect = document.querySelector("#color");
  if (!colorSelect) return;
  const colors = [...new Set(products.map((product) => product.color).filter(Boolean))].sort();
  colorSelect.insertAdjacentHTML("beforeend", colors.map((color) => `<option value="${escapeHTML(color)}">${escapeHTML(color.charAt(0).toUpperCase() + color.slice(1))}</option>`).join(""));
}

function catalogQuery(form) {
  const formData = new FormData(form);
  const params = new URLSearchParams();
  ["search", "color", "geologicalType", "mineralStatus", "condition", "sort"].forEach((name) => {
    const value = String(formData.get(name) || "").trim();
    if (value) params.set(name, value);
  });
  return params;
}

async function initCatalog() {
  const form = document.querySelector("#catalog-controls");
  if (!form) return;
  const resultContainer = document.querySelector("#catalog-results");
  const featuredContainer = document.querySelector("#featured-products");
  const emptyState = document.querySelector("#catalog-empty");
  const resultCount = document.querySelector("#result-count");

  resultContainer.innerHTML = `<p role="status">Loading products...</p>`;
  featuredContainer.innerHTML = `<p role="status">Loading popular picks...</p>`;
  try {
    const allProducts = await apiFetch("/api/products?availableOnly=false");
    populateColorOptions(allProducts);
    renderCards(allProducts.filter((product) => product.popular && product.available), featuredContainer);
  } catch (error) {
    featuredContainer.innerHTML = `<p class="form-status error" role="alert">${escapeHTML(error.message)}</p>`;
  }

  async function updateCatalog() {
    resultContainer.innerHTML = `<p role="status">Loading products...</p>`;
    emptyState.hidden = true;
    try {
      const query = catalogQuery(form);
      const results = await apiFetch(`/api/products?${query.toString()}`);
      renderCards(results, resultContainer);
      resultCount.textContent = `${results.length} ${results.length === 1 ? "product" : "products"} found`;
      emptyState.hidden = results.length !== 0;
      emptyState.innerHTML = `<h3>No matching products found</h3><p>Try a different search term or clear one of the filters.</p>`;
    } catch (error) {
      resultCount.textContent = "";
      resultContainer.innerHTML = `<p class="form-status error" role="alert">${escapeHTML(error.message)} Try again after confirming the API is running.</p>`;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateCatalog();
  });
  form.addEventListener("change", updateCatalog);
  document.querySelector("#clear-filters").addEventListener("click", () => {
    form.reset();
    updateCatalog();
  });
  updateCatalog();
}

async function initProductDetail() {
  const container = document.querySelector("#product-detail");
  if (!container) return;
  const productId = new URLSearchParams(window.location.search).get("id");
  container.innerHTML = `<p role="status">Loading product details...</p>`;

  try {
    if (!productId) {
      const error = new Error("We could not find that specimen.");
      error.code = "product_not_found";
      throw error;
    }
    const product = await apiFetch(`/api/products/${encodeURIComponent(productId || "")}`);
    document.title = `${product.name} | MJ's Rock Shop`;
    const warningMarkup = [product.safetyWarning ? `<div class="warning"><strong>Safety warning:</strong> ${escapeHTML(product.safetyWarning)}</div>` : "", product.handlingWarning ? `<div class="warning"><strong>Handling warning:</strong> ${escapeHTML(product.handlingWarning)}</div>` : ""].join("");
    const purchaseMarkup = product.available ? `<a class="button" href="checkout.html?product=${encodeURIComponent(product.id)}">Buy this specimen</a>` : `<p class="unavailable">This specimen is currently unavailable.</p>`;

    container.innerHTML = `<div class="detail-layout">
      <div><img class="detail-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.imageAlt)}"></div>
      <div>
        ${product.popular ? `<span class="badge">Popular pick</span>` : ""}
        <h2>${escapeHTML(product.name)}</h2>
        <p class="detail-price">${formatPrice(product.price)}</p>
        <p>${escapeHTML(product.description)}</p>
        ${warningMarkup}
        <table class="characteristics"><caption class="visually-hidden">Product characteristics</caption><tbody>
          <tr><th scope="row">Color</th><td>${escapeHTML(displayValue(product.color))}</td></tr>
          <tr><th scope="row">Geological type</th><td>${escapeHTML(displayValue(product.geologicalType))}</td></tr>
          <tr><th scope="row">Identified as a mineral</th><td>${escapeHTML(displayValue(product.isMineral))}</td></tr>
          <tr><th scope="row">Condition</th><td>${escapeHTML(displayValue(product.condition))}</td></tr>
        </tbody></table>
        <div class="button-row">${purchaseMarkup}<a class="button button-secondary" href="index.html">Back to shop</a></div>
      </div>
    </div>`;
  } catch (error) {
    const message = error.code === "product_not_found" ? "We could not find that specimen." : `${error.message} Try again after confirming the API is running.`;
    container.innerHTML = `<div class="empty-state" role="alert"><h2>Product not found</h2><p>${escapeHTML(message)}</p><a class="button" href="index.html">Return to the shop</a></div>`;
  }
}

initCatalog();
initProductDetail();

