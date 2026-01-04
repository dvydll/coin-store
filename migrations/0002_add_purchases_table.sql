-- Migration number: 0002 	 2026-01-04T13:02:19.532Z

CREATE TABLE purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  payment_session_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER,
  currency TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  payment_status TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_purchases_stripe_session
ON purchases(payment_session_id);

CREATE INDEX idx_purchases_user
ON purchases(user_id);

CREATE INDEX idx_purchases_product
ON purchases(product_id);

CREATE TRIGGER ensure_valid_payment_status_value
BEFORE INSERT ON purchases
FOR EACH ROW
WHEN NEW.payment_status NOT IN ('complete', 'expired', 'open')
BEGIN
  SELECT RAISE(ABORT, 'payment_status only accepts "complete", "expired" or "open" values');
END;