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

CREATE INDEX IF NOT EXISTS idx_products_active_inventory ON products (active, inventory_quantity);
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_shipping_product ON product_shipping_options (product_id);

