-- Enable the core crypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Company Table
CREATE TABLE company (
  company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  email TEXT UNIQUE CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')
);

-- 2. Property Table
CREATE TABLE property (
  property_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  property_name TEXT NOT NULL,
  CONSTRAINT fk_property_company FOREIGN KEY (company_id) 
    REFERENCES company(company_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 3. Unit Table (Completely normalized: status column removed)
CREATE TABLE "unit" (
  unit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  unit_name TEXT NOT NULL,        
  unit_type TEXT NOT NULL,        -- e.g., 'Apartment', 'Shop'
  rent NUMERIC(12,2) NOT NULL CHECK (rent >= 0),
  CONSTRAINT fk_unit_property FOREIGN KEY (property_id) 
    REFERENCES property(property_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 4. Tenant Table
CREATE TABLE tenant (
  tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  move_in_date DATE NOT NULL,
  move_out_date DATE,
  CONSTRAINT fk_tenant_unit FOREIGN KEY (unit_id) 
    REFERENCES "unit"(unit_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_logical_dates CHECK (move_out_date IS NULL OR move_out_date >= move_in_date)
);

-- CRITICAL BUSINESS RULE: Enforce zero or one active tenant per unit
CREATE UNIQUE INDEX ux_tenant_unit_active
  ON tenant (unit_id)
  WHERE move_out_date IS NULL;

-- 5. Payment Table (Protected from cascade deletion)
CREATE TABLE payment (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0), -- Payments must be positive
  payment_date TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT fk_payment_tenant FOREIGN KEY (tenant_id) 
    REFERENCES tenant(tenant_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Performance Indexes for Foreign Key Joins
CREATE INDEX idx_property_company ON property(company_id);
CREATE INDEX idx_unit_property ON "unit"(property_id);
CREATE INDEX idx_tenant_unit ON tenant(unit_id);
CREATE INDEX idx_payment_tenant ON payment(tenant_id);
