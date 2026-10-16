function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

const API_BASE_URL = window.MJ_ROCK_SHOP_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`;

async function apiFetch(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error?.message || "The API request could not be completed.");
    error.code = payload?.error?.code || "api_error";
    error.status = response.status;
    throw error;
  }
  return payload;
}

// Checkout still uses the prototype data source until its API migration.
function getProductById(id) {
  return products.find((product) => product.id === id);
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "Unknown / not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
