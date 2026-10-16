function productCard(product) {
  const availability = product.available
    ? `<span>Available</span>`
    : `<span class="unavailable">Currently unavailable</span>`;
  const popular = product.popular ? `<span class="badge">Popular pick</span>` : "";
  const purchaseAction = product.available
    ? `<a class="button" href="checkout.html?product=${encodeURIComponent(product.id)}">Buy</a>`
    : `<span class="button button-secondary" aria-disabled="true">Unavailable</span>`;

  return `<article class="product-card">
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

function populateColorOptions() {
  const colorSelect = document.querySelector("#color");
  if (!colorSelect) return;
  const colors = [...new Set(products.map((product) => product.color).filter(Boolean))].sort();
  colorSelect.insertAdjacentHTML("beforeend", colors.map((color) => `<option value="${escapeHTML(color)}">${escapeHTML(color.charAt(0).toUpperCase() + color.slice(1))}</option>`).join(""));
}

function matchesSearch(product, search) {
  if (!search) return true;
  const searchable = [product.name, product.description, product.color, ...product.tags].filter(Boolean).join(" ").toLowerCase();
  return searchable.includes(search.toLowerCase());
}

function filterProducts(form) {
  const formData = new FormData(form);
  const search = String(formData.get("search") || "").trim();
  const color = formData.get("color");
  const geologicalType = formData.get("geologicalType");
  const mineralStatus = formData.get("mineralStatus");
  const condition = formData.get("condition");
  const sort = formData.get("sort");

  const filtered = products.filter((product) =>
    product.available &&
    matchesSearch(product, search) &&
    (!color || product.color === color) &&
    (!geologicalType || product.geologicalType === geologicalType) &&
    (!mineralStatus || (mineralStatus === "mineral" ? product.isMineral : !product.isMineral)) &&
    (!condition || product.condition === condition)
  );

  if (sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "featured") filtered.sort((a, b) => Number(b.popular) - Number(a.popular));
  return filtered;
}

function initCatalog() {
  const form = document.querySelector("#catalog-controls");
  if (!form) return;
  const resultContainer = document.querySelector("#catalog-results");
  const featuredContainer = document.querySelector("#featured-products");
  const emptyState = document.querySelector("#catalog-empty");
  const resultCount = document.querySelector("#result-count");

  populateColorOptions();
  renderCards(products.filter((product) => product.popular), featuredContainer);

  function updateCatalog() {
    const results = filterProducts(form);
    renderCards(results, resultContainer);
    resultCount.textContent = `${results.length} ${results.length === 1 ? "product" : "products"} found`;
    emptyState.hidden = results.length !== 0;
    emptyState.innerHTML = `<h3>No matching products found</h3><p>Try a different search term or clear one of the filters.</p>`;
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

function initProductDetail() {
  const container = document.querySelector("#product-detail");
  if (!container) return;
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = getProductById(productId);

  if (!product) {
    container.innerHTML = `<div class="empty-state"><h2>Product not found</h2><p>We could not find that specimen. Return to the shop to choose another product.</p><a class="button" href="index.html">Return to the shop</a></div>`;
    return;
  }

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
}

initCatalog();
initProductDetail();
