-- SQLite schema for the local classroom database.
-- The types and constraints are intentionally close to PostgreSQL SQL.

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price > 0),
    image TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    popular INTEGER NOT NULL DEFAULT 0 CHECK (popular IN (0, 1)),
    color TEXT,
    tags_json TEXT NOT NULL,
    geological_type TEXT,
    is_mineral INTEGER CHECK (is_mineral IN (0, 1) OR is_mineral IS NULL),
    specimen_condition TEXT NOT NULL CHECK (specimen_condition IN ('raw', 'polished')),
    safety_warning TEXT,
    handling_warning TEXT,
    inventory_quantity INTEGER NOT NULL DEFAULT 0 CHECK (inventory_quantity >= 0),
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    updated_at TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0)
);

CREATE TABLE IF NOT EXISTS product_shipping_options (
    product_id TEXT NOT NULL,
    carrier TEXT NOT NULL,
    service TEXT NOT NULL,
    PRIMARY KEY (product_id, carrier, service),
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CHECK (carrier <> ''),
    CHECK (service <> '')
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_zip TEXT NOT NULL,
    shipping_carrier TEXT NOT NULL,
    shipping_service TEXT NOT NULL,
    subtotal NUMERIC NOT NULL CHECK (subtotal > 0),
    total NUMERIC NOT NULL CHECK (total > 0),
    payment_reference TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed')),
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC NOT NULL CHECK (unit_price > 0),
    line_total NUMERIC NOT NULL CHECK (line_total > 0),
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_type TEXT NOT NULL CHECK (message_type IN ('message', 'interest')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT,
    interest TEXT,
    gateway_reference TEXT NOT NULL,
    created_at TEXT NOT NULL,
    CHECK (message IS NOT NULL OR interest IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_products_active_inventory ON products (active, inventory_quantity);
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_shipping_product ON product_shipping_options (product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at);

