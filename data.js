/* =========================================================
   data.js — In-memory sample data store
   ---------------------------------------------------------
   Mirrors the PostgreSQL schema (company, property, unit,
   tenant, payment) so swapping in a FastAPI backend later
   only requires replacing these arrays with API calls.
   ========================================================= */

/* Dates are generated relative to "today" so the demo
   always shows current-month activity. */
function daysAgo(n, time = '10:00:00') {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10) + 'T' + time;
}

const DB = {
  company: {
    company_id: 'c-001',
    company_name: 'Sunrise Rentals Ltd',
    owner_name: 'Bella Naphter',
    phone: '+254 712 345 678',
    email: 'owner@sunriserentals.com'
  },

  properties: [
    { property_id: 'p-001', property_name: 'Sunrise Apartments' },
    { property_id: 'p-002', property_name: 'Palm Court' },
    { property_id: 'p-003', property_name: 'Riverside Plaza' },
    { property_id: 'p-004', property_name: 'Green Valley Homes' }
  ],

  units: [
    // Sunrise Apartments
    { unit_id: 'u-001', property_id: 'p-001', unit_name: 'A-101', unit_type: 'Apartment', rent: 25000 },
    { unit_id: 'u-002', property_id: 'p-001', unit_name: 'A-102', unit_type: 'Apartment', rent: 25000 },
    { unit_id: 'u-003', property_id: 'p-001', unit_name: 'A-103', unit_type: 'Apartment', rent: 27000 },
    { unit_id: 'u-004', property_id: 'p-001', unit_name: 'A-201', unit_type: 'Apartment', rent: 28000 },
    { unit_id: 'u-005', property_id: 'p-001', unit_name: 'A-202', unit_type: 'Apartment', rent: 28000 },
    { unit_id: 'u-006', property_id: 'p-001', unit_name: 'A-203', unit_type: 'Studio',    rent: 18000 },
    // Palm Court
    { unit_id: 'u-007', property_id: 'p-002', unit_name: 'PC-01', unit_type: 'Bedsitter', rent: 12000 },
    { unit_id: 'u-008', property_id: 'p-002', unit_name: 'PC-02', unit_type: 'Bedsitter', rent: 12000 },
    { unit_id: 'u-009', property_id: 'p-002', unit_name: 'PC-03', unit_type: 'One Bedroom', rent: 17000 },
    { unit_id: 'u-010', property_id: 'p-002', unit_name: 'PC-04', unit_type: 'One Bedroom', rent: 17000 },
    { unit_id: 'u-011', property_id: 'p-002', unit_name: 'PC-05', unit_type: 'Two Bedroom', rent: 24000 },
    // Riverside Plaza
    { unit_id: 'u-012', property_id: 'p-003', unit_name: 'RP-G1', unit_type: 'Shop',   rent: 35000 },
    { unit_id: 'u-013', property_id: 'p-003', unit_name: 'RP-G2', unit_type: 'Shop',   rent: 35000 },
    { unit_id: 'u-014', property_id: 'p-003', unit_name: 'RP-G3', unit_type: 'Shop',   rent: 40000 },
    { unit_id: 'u-015', property_id: 'p-003', unit_name: 'RP-F1', unit_type: 'Office', rent: 55000 },
    { unit_id: 'u-016', property_id: 'p-003', unit_name: 'RP-F2', unit_type: 'Office', rent: 55000 },
    // Green Valley Homes
    { unit_id: 'u-017', property_id: 'p-004', unit_name: 'GV-01', unit_type: 'Townhouse', rent: 65000 },
    { unit_id: 'u-018', property_id: 'p-004', unit_name: 'GV-02', unit_type: 'Townhouse', rent: 65000 },
    { unit_id: 'u-019', property_id: 'p-004', unit_name: 'GV-03', unit_type: 'Townhouse', rent: 70000 }
  ],

  tenants: [
    { tenant_id: 't-001', unit_id: 'u-001', full_name: 'James Mwangi',    phone: '+254 700 111 001', move_in_date: '2024-03-01', move_out_date: null },
    { tenant_id: 't-002', unit_id: 'u-002', full_name: 'Grace Wanjiru',   phone: '+254 700 111 002', move_in_date: '2024-06-15', move_out_date: null },
    { tenant_id: 't-003', unit_id: 'u-004', full_name: 'Peter Otieno',    phone: '+254 700 111 003', move_in_date: '2023-11-01', move_out_date: null },
    { tenant_id: 't-004', unit_id: 'u-005', full_name: 'Mary Achieng',    phone: '+254 700 111 004', move_in_date: '2025-01-10', move_out_date: null },
    { tenant_id: 't-005', unit_id: 'u-007', full_name: 'Daniel Kiprop',   phone: '+254 700 111 005', move_in_date: '2024-08-01', move_out_date: null },
    { tenant_id: 't-006', unit_id: 'u-008', full_name: 'Faith Njeri',     phone: '+254 700 111 006', move_in_date: '2025-02-01', move_out_date: null },
    { tenant_id: 't-007', unit_id: 'u-009', full_name: 'Samuel Mutua',    phone: '+254 700 111 007', move_in_date: '2024-05-20', move_out_date: null },
    { tenant_id: 't-008', unit_id: 'u-011', full_name: 'Lucy Wambui',     phone: '+254 700 111 008', move_in_date: '2023-09-01', move_out_date: null },
    { tenant_id: 't-009', unit_id: 'u-012', full_name: 'Naivas Mini Mart', phone: '+254 700 111 009', move_in_date: '2023-01-01', move_out_date: null },
    { tenant_id: 't-010', unit_id: 'u-013', full_name: 'Bloom Pharmacy',  phone: '+254 700 111 010', move_in_date: '2024-04-01', move_out_date: null },
    { tenant_id: 't-011', unit_id: 'u-015', full_name: 'Apex Consulting', phone: '+254 700 111 011', move_in_date: '2022-07-01', move_out_date: null },
    { tenant_id: 't-012', unit_id: 'u-017', full_name: 'Dr. Alice Kamau', phone: '+254 700 111 012', move_in_date: '2024-12-01', move_out_date: null },
    { tenant_id: 't-013', unit_id: 'u-018', full_name: 'John Baraka',     phone: '+254 700 111 013', move_in_date: '2025-03-15', move_out_date: null },
    // Former tenant (moved out) — kept for payment history
    { tenant_id: 't-014', unit_id: 'u-003', full_name: 'Kevin Odhiambo',  phone: '+254 700 111 014', move_in_date: '2023-02-01', move_out_date: '2025-05-31' }
  ],

  payments: [
    // This month
    { payment_id: 'pay-001', tenant_id: 't-001', amount: 25000, payment_date: daysAgo(3, '09:15:00') },
    { payment_id: 'pay-002', tenant_id: 't-002', amount: 25000, payment_date: daysAgo(4, '14:30:00') },
    { payment_id: 'pay-003', tenant_id: 't-009', amount: 35000, payment_date: daysAgo(5, '10:00:00') },
    { payment_id: 'pay-004', tenant_id: 't-011', amount: 55000, payment_date: daysAgo(5, '08:45:00') },
    { payment_id: 'pay-005', tenant_id: 't-005', amount: 12000, payment_date: daysAgo(2, '16:20:00') },
    { payment_id: 'pay-006', tenant_id: 't-012', amount: 65000, payment_date: daysAgo(1, '11:05:00') },
    // Last month
    { payment_id: 'pay-007', tenant_id: 't-003', amount: 28000, payment_date: daysAgo(8,  '13:00:00') },
    { payment_id: 'pay-008', tenant_id: 't-007', amount: 17000, payment_date: daysAgo(9,  '09:40:00') },
    { payment_id: 'pay-009', tenant_id: 't-008', amount: 24000, payment_date: daysAgo(10, '15:10:00') },
    { payment_id: 'pay-010', tenant_id: 't-004', amount: 28000, payment_date: daysAgo(31, '10:30:00') },
    { payment_id: 'pay-011', tenant_id: 't-006', amount: 12000, payment_date: daysAgo(33, '12:00:00') },
    { payment_id: 'pay-012', tenant_id: 't-010', amount: 35000, payment_date: daysAgo(34, '09:00:00') },
    { payment_id: 'pay-013', tenant_id: 't-013', amount: 65000, payment_date: daysAgo(20, '14:45:00') },
    { payment_id: 'pay-014', tenant_id: 't-014', amount: 27000, payment_date: daysAgo(63, '10:00:00') },
    { payment_id: 'pay-015', tenant_id: 't-001', amount: 25000, payment_date: daysAgo(34, '09:30:00') },
    { payment_id: 'pay-016', tenant_id: 't-009', amount: 35000, payment_date: daysAgo(35, '10:00:00') },
    { payment_id: 'pay-017', tenant_id: 't-011', amount: 55000, payment_date: daysAgo(35, '08:30:00') },
    { payment_id: 'pay-018', tenant_id: 't-012', amount: 65000, payment_date: daysAgo(32, '11:00:00') }
  ],

  // Recent Activity feed (UI-only; populated by user actions too)
  activity: [
    { icon: 'payment', text: 'Payment of KES 65,000 received from Dr. Alice Kamau (GV-01)', time: daysAgo(1, '11:05:00') },
    { icon: 'payment', text: 'Payment of KES 12,000 received from Daniel Kiprop (PC-01)', time: daysAgo(2, '16:20:00') },
    { icon: 'tenant',  text: 'Tenant Kevin Odhiambo vacated Unit A-103', time: daysAgo(36, '17:00:00') },
    { icon: 'tenant',  text: 'Tenant John Baraka moved into Unit GV-02', time: daysAgo(113, '09:00:00') }
  ]
};

/* ---------- Query helpers (backend-ready seams) ---------- */

const Store = {
  getCompany: () => DB.company,
  getProperties: () => DB.properties,
  getProperty: (id) => DB.properties.find(p => p.property_id === id),
  getUnits: (propertyId) => propertyId ? DB.units.filter(u => u.property_id === propertyId) : DB.units,
  getUnit: (id) => DB.units.find(u => u.unit_id === id),

  // Active tenant = tenant with no move_out_date (matches ux_tenant_unit_active)
  getActiveTenant: (unitId) => DB.tenants.find(t => t.unit_id === unitId && !t.move_out_date),
  getTenant: (id) => DB.tenants.find(t => t.tenant_id === id),
  getTenantsForUnit: (unitId) => DB.tenants.filter(t => t.unit_id === unitId),

  getPayments: () => [...DB.payments].sort((a, b) => b.payment_date.localeCompare(a.payment_date)),
  getPaymentsForTenants: (tenantIds) =>
    Store.getPayments().filter(p => tenantIds.includes(p.tenant_id)),

  getActivity: () => [...DB.activity].sort((a, b) => b.time.localeCompare(a.time)),

  /* ---------- Mutations (will map to POST/PUT endpoints) ---------- */

  recordPayment(tenantId, amount) {
    const payment = {
      payment_id: 'pay-' + Date.now(),
      tenant_id: tenantId,
      amount: Number(amount),
      payment_date: new Date().toISOString()
    };
    DB.payments.push(payment);
    const tenant = Store.getTenant(tenantId);
    const unit = Store.getUnit(tenant.unit_id);
    Store.logActivity('payment', `Payment of ${fmtMoney(amount)} received from ${tenant.full_name} (${unit.unit_name})`);
    return payment;
  },

  updateTenant(tenantId, fields) {
    const tenant = Store.getTenant(tenantId);
    Object.assign(tenant, fields);
    Store.logActivity('tenant', `Tenant details updated for ${tenant.full_name}`);
    return tenant;
  },

  assignTenant(unitId, fullName, phone, moveInDate) {
    const tenant = {
      tenant_id: 't-' + Date.now(),
      unit_id: unitId,
      full_name: fullName,
      phone: phone,
      move_in_date: moveInDate,
      move_out_date: null
    };
    DB.tenants.push(tenant);
    const unit = Store.getUnit(unitId);
    Store.logActivity('tenant', `Tenant ${fullName} moved into Unit ${unit.unit_name}`);
    return tenant;
  },

  vacateUnit(unitId) {
    const tenant = Store.getActiveTenant(unitId);
    if (!tenant) return null;
    tenant.move_out_date = new Date().toISOString().slice(0, 10);
    const unit = Store.getUnit(unitId);
    Store.logActivity('tenant', `Tenant ${tenant.full_name} vacated Unit ${unit.unit_name}`);
    return tenant;
  },

  logActivity(icon, text) {
    DB.activity.unshift({ icon, text, time: new Date().toISOString() });
  },

  /* ---------- Derived business metrics ---------- */

  propertyStats(propertyId) {
    const units = Store.getUnits(propertyId);
    const occupied = units.filter(u => Store.getActiveTenant(u.unit_id));
    return {
      totalUnits: units.length,
      occupiedUnits: occupied.length,
      vacantUnits: units.length - occupied.length,
      expectedIncome: units.reduce((s, u) => s + u.rent, 0),
      occupiedIncome: occupied.reduce((s, u) => s + u.rent, 0)
    };
  },

  portfolioStats() {
    const now = new Date();
    const monthKey = now.toISOString().slice(0, 7); // YYYY-MM
    const units = Store.getUnits();
    const occupiedUnits = units.filter(u => Store.getActiveTenant(u.unit_id));
    const expectedIncome = occupiedUnits.reduce((s, u) => s + u.rent, 0);

    const monthlyCollection = DB.payments
      .filter(p => p.payment_date.slice(0, 7) === monthKey)
      .reduce((s, p) => s + p.amount, 0);

    return {
      monthlyCollection,
      outstandingRent: Math.max(0, expectedIncome - monthlyCollection),
      totalUnits: units.length,
      occupiedUnits: occupiedUnits.length,
      vacantUnits: units.length - occupiedUnits.length,
      occupancyRate: units.length ? Math.round((occupiedUnits.length / units.length) * 100) : 0,
      expectedIncome
    };
  },

  /* Collected this month per property (for Reports) */
  collectedForProperty(propertyId) {
    const monthKey = new Date().toISOString().slice(0, 7);
    const unitIds = Store.getUnits(propertyId).map(u => u.unit_id);
    const tenantIds = DB.tenants.filter(t => unitIds.includes(t.unit_id)).map(t => t.tenant_id);
    return DB.payments
      .filter(p => tenantIds.includes(p.tenant_id) && p.payment_date.slice(0, 7) === monthKey)
      .reduce((s, p) => s + p.amount, 0);
  }
};

/* ---------- Formatting helpers ---------- */

function fmtMoney(amount) {
  return 'KES ' + Number(amount).toLocaleString('en-KE');
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(iso) {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + 'd ago';
  return fmtDate(iso);
}
