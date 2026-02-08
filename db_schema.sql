-- ============================================
-- M7 Distribution Platform - Database Schema
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: customers
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location_geo TEXT,
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  total_debt DECIMAL(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'risk', 'vip')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  stock_kg DECIMAL(10, 2) DEFAULT 0.00,
  price_per_bag DECIMAL(10, 2) NOT NULL,
  bag_weight_kg DECIMAL(5, 2) DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('cash', 'credit')),
  is_paid BOOLEAN DEFAULT FALSE,
  order_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_bags INTEGER NOT NULL,
  quantity_kg DECIMAL(10, 2) NOT NULL,
  price_per_bag DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_payment_type ON orders(payment_type);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- ============================================
-- TRIGGERS: Update total_debt automatically
-- ============================================
CREATE OR REPLACE FUNCTION update_customer_debt()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_type = 'credit' AND NEW.is_paid = FALSE THEN
    UPDATE customers
    SET total_debt = total_debt + NEW.total_amount
    WHERE id = NEW.customer_id;
  ELSIF NEW.is_paid = TRUE AND OLD.is_paid = FALSE AND NEW.payment_type = 'credit' THEN
    UPDATE customers
    SET total_debt = total_debt - NEW.total_amount
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_debt
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_customer_debt();

-- ============================================
-- TRIGGERS: Auto-update trust_score based on debt
-- ============================================
CREATE OR REPLACE FUNCTION update_trust_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_debt > 50000 THEN
    NEW.status = 'risk';
    NEW.trust_score = GREATEST(NEW.trust_score - 10, 0);
  ELSIF NEW.total_debt > 100000 THEN
    NEW.status = 'risk';
    NEW.trust_score = GREATEST(NEW.trust_score - 25, 0);
  ELSIF NEW.total_debt < 10000 AND NEW.trust_score > 70 THEN
    NEW.status = 'vip';
  ELSE
    NEW.status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trust
BEFORE UPDATE ON customers
FOR EACH ROW
WHEN (OLD.total_debt IS DISTINCT FROM NEW.total_debt)
EXECUTE FUNCTION update_trust_score();

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================
-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated and anon users (internal tool)
CREATE POLICY "Allow all for customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all for products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all for orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all for order_items" ON order_items FOR ALL USING (true);

-- ============================================
-- SEED DATA: Products
-- ============================================
INSERT INTO products (name, description, stock_kg, price_per_bag, bag_weight_kg) VALUES
  ('Potato (Frying)', 'Premium quality potatoes for frying', 5000.00, 2500.00, 50.00),
  ('Onion (Red)', 'Fresh red onions', 3000.00, 1800.00, 40.00),
  ('Onion (White)', 'Fresh white onions', 2500.00, 1600.00, 40.00),
  ('Potato (Regular)', 'Standard quality potatoes', 4000.00, 2000.00, 50.00)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED DATA: Customers
-- ============================================
INSERT INTO customers (name, shop_name, phone, location_geo, trust_score, total_debt, status) VALUES
  ('Rajesh Kumar', 'Kumar Vegetables & Sons', '+91-9876543210', 'Azadpur Mandi, Delhi', 85, 5000.00, 'vip'),
  ('Priya Singh', 'Singh Trading Co.', '+91-9876543211', 'Sector 18, Noida', 45, 78000.00, 'risk'),
  ('Amit Sharma', 'Sharma Fresh Mart', '+91-9876543212', 'Connaught Place, Delhi', 70, 15000.00, 'active'),
  ('Sunita Devi', 'Sunita Wholesale', '+91-9876543213', 'Lajpat Nagar, Delhi', 30, 125000.00, 'risk'),
  ('Vikram Patel', 'Patel Groceries', '+91-9876543214', 'Karol Bagh, Delhi', 90, 2000.00, 'vip'),
  ('Neha Gupta', 'Gupta Store', '+91-9876543215', 'Rohini, Delhi', 60, 30000.00, 'active'),
  ('Ravi Verma', 'Verma Enterprises', '+91-9876543216', 'Dwarka, Delhi', 50, 45000.00, 'active')
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: Sample Orders (Last 30 days)
-- ============================================
DO $$
DECLARE
  customer_ids UUID[];
  product_ids UUID[];
  i INTEGER;
  random_customer UUID;
  random_product UUID;
  random_bags INTEGER;
  random_price DECIMAL;
  random_payment TEXT;
  order_id UUID;
BEGIN
  -- Get all customer and product IDs
  SELECT ARRAY_AGG(id) INTO customer_ids FROM customers;
  SELECT ARRAY_AGG(id) INTO product_ids FROM products;

  -- Create 50 random orders
  FOR i IN 1..50 LOOP
    random_customer := customer_ids[1 + floor(random() * array_length(customer_ids, 1))];
    random_product := product_ids[1 + floor(random() * array_length(product_ids, 1))];
    random_bags := 1 + floor(random() * 20);

    SELECT price_per_bag INTO random_price FROM products WHERE id = random_product;

    random_payment := CASE WHEN random() > 0.4 THEN 'credit' ELSE 'cash' END;

    -- Create order
    INSERT INTO orders (customer_id, total_amount, payment_type, is_paid, order_date)
    VALUES (
      random_customer,
      random_bags * random_price,
      random_payment,
      CASE WHEN random_payment = 'cash' THEN true ELSE random() > 0.3 END,
      CURRENT_DATE - (floor(random() * 30))::INTEGER
    )
    RETURNING id INTO order_id;

    -- Create order item
    INSERT INTO order_items (order_id, product_id, quantity_bags, quantity_kg, price_per_bag, subtotal)
    VALUES (
      order_id,
      random_product,
      random_bags,
      random_bags * 50,
      random_price,
      random_bags * random_price
    );
  END LOOP;
END $$;

-- ============================================
-- USEFUL VIEWS for Dashboard
-- ============================================

-- View: Customer Summary with Recent Activity
CREATE OR REPLACE VIEW customer_summary AS
SELECT
  c.id,
  c.name,
  c.shop_name,
  c.phone,
  c.total_debt,
  c.trust_score,
  c.status,
  COUNT(o.id) as total_orders,
  SUM(CASE WHEN o.payment_type = 'cash' THEN o.total_amount ELSE 0 END) as cash_sales,
  SUM(CASE WHEN o.payment_type = 'credit' THEN o.total_amount ELSE 0 END) as credit_sales,
  MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;

-- View: Daily Sales Summary
CREATE OR REPLACE VIEW daily_sales AS
SELECT
  order_date,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_sales,
  SUM(CASE WHEN payment_type = 'cash' THEN total_amount ELSE 0 END) as cash_sales,
  SUM(CASE WHEN payment_type = 'credit' THEN total_amount ELSE 0 END) as credit_sales
FROM orders
GROUP BY order_date
ORDER BY order_date DESC;

-- View: Product Performance
CREATE OR REPLACE VIEW product_performance AS
SELECT
  p.id,
  p.name,
  p.stock_kg,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity_bags) as total_bags_sold,
  SUM(oi.quantity_kg) as total_kg_sold,
  SUM(oi.subtotal) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id;

-- ============================================
-- SUCCESS!
-- ============================================
-- Database schema created successfully!
-- Next: Copy your Supabase URL and Anon Key to .env file
-- ============================================
