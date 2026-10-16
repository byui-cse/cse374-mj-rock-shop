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

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "Unknown / not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
