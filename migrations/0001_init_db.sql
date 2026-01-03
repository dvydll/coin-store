-- Migration number: 0001 	 2026-01-03T17:13:05.011Z

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  discord_id TEXT NOT NULL UNIQUE,

  email TEXT UNIQUE,
  discord_meta TEXT NOT NULL,

  server_coins INTEGER NOT NULL DEFAULT 0,

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  deleted_at INTEGER
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  expires_at INTEGER NOT NULL,
  revoked_at INTEGER,
  metadata TEXT,

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,

  product_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  product_description TEXT,

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  deleted_at INTEGER
);

-- Trigger para asegurar solo valores validos en products.currency
CREATE TRIGGER ensure_valid_currency_value
BEFORE INSERT ON products
FOR EACH ROW
WHEN NEW.currency NOT IN ('eur', 'usd')
BEGIN
  SELECT RAISE(ABORT, 'currency only accepts "eur" or "usd" values');
END;

-- Trigger para borrar sesiones revocadas hace más de 3 meses
CREATE TRIGGER cleanup_revoked_sessions_on_insert
AFTER INSERT ON sessions
BEGIN
  DELETE FROM sessions
  WHERE revoked_at IS NOT NULL
    AND revoked_at < strftime('%s','now','-3 months');
END;

CREATE TRIGGER cleanup_revoked_sessions_on_update
AFTER UPDATE ON sessions
BEGIN
  DELETE FROM sessions
  WHERE revoked_at IS NOT NULL
    AND revoked_at < strftime('%s','now','-3 months');
END;

-- Trigger para actualizar los updated_at
CREATE TRIGGER update_user_timestamp
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = unixepoch() WHERE id = NEW.id;
END;

CREATE TRIGGER update_product_timestamp
AFTER UPDATE ON products
BEGIN
  UPDATE products SET updated_at = unixepoch() WHERE id = NEW.id;
END;

-- Trigger para actualizar los deleted_at
CREATE TRIGGER soft_delete_user
BEFORE DELETE ON users
BEGIN
  UPDATE users SET deleted_at = unixepoch() WHERE id = OLD.id; -- Marca como eliminado
  SELECT RAISE(IGNORE); -- Cancela el DELETE físico
END;

CREATE TRIGGER soft_delete_product
BEFORE DELETE ON products
BEGIN
  UPDATE products SET deleted_at = unixepoch() WHERE id = OLD.id; -- Marca como eliminado
  SELECT RAISE(IGNORE); -- Cancela el DELETE físico
END;

-- Solo devuelve usuarios activos
CREATE VIEW active_users AS
SELECT *
FROM users
WHERE deleted_at IS NULL;

-- Solo devuelve productos activos
CREATE VIEW active_products AS
SELECT *
FROM products
WHERE deleted_at IS NULL;
