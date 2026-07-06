/* =========================================================
   app.js — Landlord Dashboard SPA
   ---------------------------------------------------------
   Simple hash-free view router + renderers for:
   Dashboard, Portfolio, Property, Unit, Payments,
   Reports, Management.
   ========================================================= */

const viewRoot   = document.getElementById('viewRoot');
const pageTitle  = document.getElementById('pageTitle');
const pageSub    = document.getElementById('pageSub');
const navItems   = document.querySelectorAll('.nav-item');

const VIEW_META = {
  dashboard:  { title: 'Dashboard',  sub: 'How is my rental business performing today?', nav: 'dashboard' },
  portfolio:  { title: 'Portfolio',  sub: 'What properties do I own?',                   nav: 'portfolio' },
  property:   { title: 'Property',   sub: 'How is this Property performing?',            nav: 'portfolio' },
  unit:       { title: 'Unit',       sub: 'Everything about one Unit.',                  nav: 'portfolio' },
  payments:   { title: 'Payments',   sub: 'Who has paid?',                               nav: 'payments' },
  reports:    { title: 'Reports',    sub: 'What are my business numbers?',               nav: 'reports' },
  management: { title: 'Management', sub: 'Configure my rental business.',               nav: 'management' }
};

/* ---------- Router ---------- */

function navigate(view, params = {}) {
  const meta = VIEW_META[view];
  pageTitle.textContent = meta.title;
  pageSub.textContent = meta.sub;
  navItems.forEach(btn => btn.classList.toggle('active', btn.dataset.view === meta.nav));
  RENDERERS[view](params);
  viewRoot.scrollTop = 0;
  window.scrollTo(0, 0);
}

navItems.forEach(btn => btn.addEventListener('click', () => {
  if (btn.dataset.action === 'login') {
    showToast('Log in will be implemented soon');
    return;
  }
  navigate(btn.dataset.view);
}));

/* ---------- Shared UI helpers ---------- */

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function kpiCard(label, value, accent = '') {
  return `
    <div class="kpi ${accent}">
      <span class="kpi-label">${label}</span>
      <span class="kpi-value">${value}</span>
    </div>`;
}

function statusBadge(occupied) {
  return occupied
    ? '<span class="badge ok">Occupied</span>'
    : '<span class="badge vacant">Vacant</span>';
}

function backLink(label, onclickExpr) {
  return `<button class="back-link" onclick="${onclickExpr}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    ${label}
  </button>`;
}

function paymentRow(p) {
  const tenant = Store.getTenant(p.tenant_id);
  const unit = Store.getUnit(tenant.unit_id);
  const property = Store.getProperty(unit.property_id);
  return `
    <tr>
      <td>
        <span class="cell-primary">${esc(tenant.full_name)}</span>
        <span class="cell-secondary">${esc(property.property_name)} · ${esc(unit.unit_name)}</span>
      </td>
      <td class="cell-amount">${fmtMoney(p.amount)}</td>
      <td class="cell-date">${fmtDateTime(p.payment_date)}</td>
    </tr>`;
}

/* ---------- View renderers ---------- */

const RENDERERS = {

  /* ===== Dashboard: "How is my rental business performing today?" ===== */
  dashboard() {
    const s = Store.portfolioStats();
    const recentPayments = Store.getPayments().slice(0, 5);
    const activity = Store.getActivity().slice(0, 6);

    viewRoot.innerHTML = `
      <section class="kpi-grid">
        ${kpiCard('Monthly Collection', fmtMoney(s.monthlyCollection), 'accent-mint')}
        ${kpiCard('Outstanding Rent', fmtMoney(s.outstandingRent), 'accent-warn')}
        ${kpiCard('Occupancy Rate', s.occupancyRate + '%', 'accent-blue')}
        ${kpiCard('Vacant Units', s.vacantUnits)}
      </section>

      <div class="two-col">
        <section class="panel">
          <div class="panel-head">
            <h2>Recent Payments</h2>
            <button class="link-btn" onclick="navigate('payments')">View all</button>
          </div>
          <table class="table">
            <tbody>${recentPayments.map(paymentRow).join('')}</tbody>
          </table>
        </section>

        <section class="panel">
          <div class="panel-head"><h2>Recent Activity</h2></div>
          <ul class="activity-list">
            ${activity.map(a => `
              <li class="activity-item">
                <span class="activity-dot ${a.icon}"></span>
                <div>
                  <p>${esc(a.text)}</p>
                  <span class="activity-time">${timeAgo(a.time)}</span>
                </div>
              </li>`).join('')}
          </ul>
        </section>
      </div>`;
  },

  /* ===== Portfolio: "What properties do I own?" ===== */
  portfolio() {
    const cards = Store.getProperties().map(p => {
      const s = Store.propertyStats(p.property_id);
      return `
        <button class="property-card" onclick="navigate('property', {propertyId: '${p.property_id}'})">
          <div class="property-card-head">
            <h3>${esc(p.property_name)}</h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="property-stats">
            <div><span class="stat-num">${s.totalUnits}</span><span class="stat-label">Total Units</span></div>
            <div><span class="stat-num ok-text">${s.occupiedUnits}</span><span class="stat-label">Occupied</span></div>
            <div><span class="stat-num warn-text">${s.vacantUnits}</span><span class="stat-label">Vacant</span></div>
          </div>
          <div class="property-income">
            <span>Monthly Expected Income</span>
            <strong>${fmtMoney(s.expectedIncome)}</strong>
          </div>
          <div class="occupancy-bar"><span style="width:${s.totalUnits ? (s.occupiedUnits / s.totalUnits) * 100 : 0}%"></span></div>
        </button>`;
    }).join('');

    viewRoot.innerHTML = `<section class="card-grid">${cards}</section>`;
  },

  /* ===== Property View: "How is this Property performing?" ===== */
  property({ propertyId }) {
    const property = Store.getProperty(propertyId);
    const s = Store.propertyStats(propertyId);

    const unitCards = Store.getUnits(propertyId).map(u => {
      const tenant = Store.getActiveTenant(u.unit_id);
      return `
        <button class="unit-card" onclick="navigate('unit', {unitId: '${u.unit_id}'})">
          <div class="unit-card-head">
            <span class="unit-code">${esc(u.unit_name)}</span>
            ${statusBadge(!!tenant)}
          </div>
          <span class="unit-type">${esc(u.unit_type)}</span>
          <span class="unit-rent">${fmtMoney(u.rent)} <small>/ month</small></span>
          ${tenant ? `<span class="unit-tenant">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke-linecap="round"/><circle cx="9.5" cy="7" r="4"/></svg>
            ${esc(tenant.full_name)}</span>` : '<span class="unit-tenant dim">No tenant</span>'}
        </button>`;
    }).join('');

    viewRoot.innerHTML = `
      ${backLink('Portfolio', "navigate('portfolio')")}
      <section class="property-summary panel">
        <h2>${esc(property.property_name)}</h2>
        <div class="summary-row">
          <div><span class="stat-num">${s.totalUnits}</span><span class="stat-label">Units</span></div>
          <div><span class="stat-num ok-text">${s.occupiedUnits}</span><span class="stat-label">Occupied</span></div>
          <div><span class="stat-num warn-text">${s.vacantUnits}</span><span class="stat-label">Vacant</span></div>
          <div><span class="stat-num">${fmtMoney(s.expectedIncome)}</span><span class="stat-label">Expected / month</span></div>
        </div>
      </section>
      <section class="card-grid units">${unitCards}</section>`;
  },

  /* ===== Unit View: "Everything about one Unit." ===== */
  unit({ unitId }) {
    const unit = Store.getUnit(unitId);
    const property = Store.getProperty(unit.property_id);
    const tenant = Store.getActiveTenant(unitId);
    const tenantIds = Store.getTenantsForUnit(unitId).map(t => t.tenant_id);
    const history = Store.getPaymentsForTenants(tenantIds);

    viewRoot.innerHTML = `
      ${backLink(esc(property.property_name), `navigate('property', {propertyId: '${property.property_id}'})`)}

      <section class="panel unit-detail">
        <div class="unit-detail-head">
          <div>
            <h2>Unit ${esc(unit.unit_name)}</h2>
            <p class="dim-text">${esc(unit.unit_type)} · ${esc(property.property_name)}</p>
          </div>
          ${statusBadge(!!tenant)}
        </div>

        <div class="detail-grid">
          <div class="detail-item"><span>Monthly Rent</span><strong>${fmtMoney(unit.rent)}</strong></div>
          <div class="detail-item"><span>Current Tenant</span><strong>${tenant ? esc(tenant.full_name) : '—'}</strong></div>
          <div class="detail-item"><span>Move-in Date</span><strong>${tenant ? fmtDate(tenant.move_in_date) : '—'}</strong></div>
          <div class="detail-item"><span>Phone</span><strong>${tenant ? esc(tenant.phone) : '—'}</strong></div>
        </div>

        <div class="action-row">
          ${tenant ? `
            <button class="btn primary" onclick="openRecordPayment('${unitId}')">Record Payment</button>
            <button class="btn" onclick="openEditTenant('${unitId}')">Edit Tenant</button>
            <button class="btn danger" onclick="openVacateUnit('${unitId}')">Vacate Unit</button>
          ` : `
            <button class="btn primary" onclick="openAssignTenant('${unitId}')">Assign Tenant</button>
          `}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><h2>Payment History</h2></div>
        ${history.length ? `
          <table class="table">
            <tbody>${history.map(paymentRow).join('')}</tbody>
          </table>` : '<p class="empty">No payments recorded for this Unit yet.</p>'}
      </section>`;
  },

  /* ===== Payments: "Who has paid?" ===== */
  payments() {
    const properties = Store.getProperties();
    viewRoot.innerHTML = `
      <section class="filters panel">
        <div class="filter-field grow">
          <label for="fSearch">Search Tenant</label>
          <input type="search" id="fSearch" placeholder="Tenant name…">
        </div>
        <div class="filter-field">
          <label for="fProperty">Property</label>
          <select id="fProperty">
            <option value="">All Properties</option>
            ${properties.map(p => `<option value="${p.property_id}">${esc(p.property_name)}</option>`).join('')}
          </select>
        </div>
        <div class="filter-field">
          <label for="fFrom">From</label>
          <input type="date" id="fFrom">
        </div>
        <div class="filter-field">
          <label for="fTo">To</label>
          <input type="date" id="fTo">
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>Payment History</h2>
          <span class="dim-text" id="payCount"></span>
        </div>
        <table class="table">
          <thead><tr><th>Tenant</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody id="payRows"></tbody>
        </table>
        <p class="empty hidden" id="payEmpty">No payments match your filters.</p>
      </section>`;

    const renderRows = () => {
      const q = document.getElementById('fSearch').value.trim().toLowerCase();
      const propertyId = document.getElementById('fProperty').value;
      const from = document.getElementById('fFrom').value;
      const to = document.getElementById('fTo').value;

      const rows = Store.getPayments().filter(p => {
        const tenant = Store.getTenant(p.tenant_id);
        const unit = Store.getUnit(tenant.unit_id);
        if (q && !tenant.full_name.toLowerCase().includes(q)) return false;
        if (propertyId && unit.property_id !== propertyId) return false;
        const day = p.payment_date.slice(0, 10);
        if (from && day < from) return false;
        if (to && day > to) return false;
        return true;
      });

      document.getElementById('payRows').innerHTML = rows.map(paymentRow).join('');
      document.getElementById('payCount').textContent = rows.length + ' payment' + (rows.length === 1 ? '' : 's');
      document.getElementById('payEmpty').classList.toggle('hidden', rows.length > 0);
    };

    ['fSearch', 'fProperty', 'fFrom', 'fTo'].forEach(id =>
      document.getElementById(id).addEventListener('input', renderRows));
    renderRows();
  },

  /* ===== Reports: "What are my business numbers?" ===== */
  reports() {
    const s = Store.portfolioStats();
    const byProperty = Store.getProperties().map(p => {
      const ps = Store.propertyStats(p.property_id);
      const collected = Store.collectedForProperty(p.property_id);
      return { name: p.property_name, expected: ps.occupiedIncome, collected };
    });
    const maxExpected = Math.max(...byProperty.map(r => r.expected), 1);

    viewRoot.innerHTML = `
      <section class="kpi-grid">
        ${kpiCard('Expected Monthly Income', fmtMoney(s.expectedIncome), 'accent-blue')}
        ${kpiCard('Total Collected', fmtMoney(s.monthlyCollection), 'accent-mint')}
        ${kpiCard('Outstanding Rent', fmtMoney(s.outstandingRent), 'accent-warn')}
        ${kpiCard('Occupancy Rate', s.occupancyRate + '%')}
        ${kpiCard('Vacant Units', s.vacantUnits)}
      </section>

      <section class="panel">
        <div class="panel-head"><h2>Income by Property <span class="dim-text">(this month)</span></h2></div>
        <div class="bar-report">
          ${byProperty.map(r => `
            <div class="bar-row">
              <span class="bar-name">${esc(r.name)}</span>
              <div class="bar-track">
                <span class="bar-expected" style="width:${(r.expected / maxExpected) * 100}%"></span>
                <span class="bar-collected" style="width:${(Math.min(r.collected, r.expected) / maxExpected) * 100}%"></span>
              </div>
              <span class="bar-figures">${fmtMoney(r.collected)} <small>of ${fmtMoney(r.expected)}</small></span>
            </div>`).join('')}
        </div>
        <div class="legend">
          <span><i class="swatch collected"></i>Collected</span>
          <span><i class="swatch expected"></i>Expected</span>
        </div>
      </section>`;
  },

  /* ===== Management: "Configure my rental business." ===== */
  management() {
    const company = Store.getCompany();
    const sections = [
      { key: 'profile', title: 'Company Profile', desc: 'Business name, owner and contact details.' },
      { key: 'properties', title: 'Property Management', desc: 'Add, rename or archive Properties.' },
      { key: 'units', title: 'Unit Management', desc: 'Manage Units and Unit Types per Property.' },
      { key: 'pricing', title: 'Rent Pricing', desc: 'Review and update monthly rent per Unit.' },
      { key: 'notifications', title: 'Notifications', desc: 'Rent reminders and payment alerts.' },
      { key: 'data', title: 'Data Management', desc: 'Export and back up your business data.' }
    ];

    viewRoot.innerHTML = `
      <section class="panel company-panel">
        <div class="company-avatar">${esc(company.company_name.charAt(0))}</div>
        <div>
          <h2>${esc(company.company_name)}</h2>
          <p class="dim-text">${esc(company.owner_name)} · ${esc(company.phone)} · ${esc(company.email)}</p>
        </div>
      </section>

      <section class="card-grid mgmt">
        ${sections.map(sec => `
          <button class="mgmt-card" onclick="openManagementSection('${sec.key}', '${esc(sec.title)}')">
            <h3>${sec.title}</h3>
            <p>${sec.desc}</p>
            <span class="mgmt-arrow">Configure
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>`).join('')}
      </section>`;
  }
};

/* ---------- Topbar company name ---------- */

document.getElementById('topbarCompany').textContent = Store.getCompany().company_name;

/* ---------- Modal ---------- */

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle   = document.getElementById('modalTitle');
const modalBody    = document.getElementById('modalBody');

function openModal(title, bodyHtml) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  modalBody.innerHTML = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- Toast ---------- */

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
}

/* ---------- Unit actions ---------- */

function openRecordPayment(unitId) {
  const unit = Store.getUnit(unitId);
  const tenant = Store.getActiveTenant(unitId);
  openModal('Record Payment', `
    <p class="dim-text">Unit ${esc(unit.unit_name)} · ${esc(tenant.full_name)}</p>
    <form id="payForm" class="modal-form">
      <label for="payAmount">Amount (KES)</label>
      <input type="number" id="payAmount" min="1" step="1" value="${unit.rent}" required>
      <button type="submit" class="btn primary full">Save Payment</button>
    </form>`);
  document.getElementById('payForm').addEventListener('submit', e => {
    e.preventDefault();
    const amount = Number(document.getElementById('payAmount').value);
    if (!(amount > 0)) return;
    Store.recordPayment(tenant.tenant_id, amount);
    closeModal();
    showToast(`Payment of ${fmtMoney(amount)} recorded for ${tenant.full_name}`);
    navigate('unit', { unitId });
  });
}

function openEditTenant(unitId) {
  const tenant = Store.getActiveTenant(unitId);
  openModal('Edit Tenant', `
    <form id="tenantForm" class="modal-form">
      <label for="tName">Full Name</label>
      <input type="text" id="tName" value="${esc(tenant.full_name)}" required>
      <label for="tPhone">Phone</label>
      <input type="tel" id="tPhone" value="${esc(tenant.phone)}">
      <label for="tMoveIn">Move-in Date</label>
      <input type="date" id="tMoveIn" value="${tenant.move_in_date}" required>
      <button type="submit" class="btn primary full">Save Changes</button>
    </form>`);
  document.getElementById('tenantForm').addEventListener('submit', e => {
    e.preventDefault();
    Store.updateTenant(tenant.tenant_id, {
      full_name: document.getElementById('tName').value.trim(),
      phone: document.getElementById('tPhone').value.trim(),
      move_in_date: document.getElementById('tMoveIn').value
    });
    closeModal();
    showToast('Tenant details updated');
    navigate('unit', { unitId });
  });
}

function openAssignTenant(unitId) {
  const unit = Store.getUnit(unitId);
  const today = new Date().toISOString().slice(0, 10);
  openModal('Assign Tenant', `
    <p class="dim-text">Unit ${esc(unit.unit_name)} · ${fmtMoney(unit.rent)} / month</p>
    <form id="assignForm" class="modal-form">
      <label for="aName">Full Name</label>
      <input type="text" id="aName" placeholder="Tenant full name" required>
      <label for="aPhone">Phone</label>
      <input type="tel" id="aPhone" placeholder="+254 7…">
      <label for="aMoveIn">Move-in Date</label>
      <input type="date" id="aMoveIn" value="${today}" required>
      <button type="submit" class="btn primary full">Assign Tenant</button>
    </form>`);
  document.getElementById('assignForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('aName').value.trim();
    if (!name) return;
    Store.assignTenant(unitId, name, document.getElementById('aPhone').value.trim(), document.getElementById('aMoveIn').value);
    closeModal();
    showToast(`Tenant ${name} assigned to Unit ${unit.unit_name}`);
    navigate('unit', { unitId });
  });
}

function openVacateUnit(unitId) {
  const unit = Store.getUnit(unitId);
  const tenant = Store.getActiveTenant(unitId);
  openModal('Vacate Unit', `
    <p>Mark <strong>${esc(tenant.full_name)}</strong> as moved out of Unit <strong>${esc(unit.unit_name)}</strong>?</p>
    <p class="dim-text">Payment history will be kept. The Unit will become Vacant.</p>
    <div class="action-row">
      <button class="btn danger" id="confirmVacate">Vacate Unit</button>
      <button class="btn" onclick="closeModal()">Cancel</button>
    </div>`);
  document.getElementById('confirmVacate').addEventListener('click', () => {
    Store.vacateUnit(unitId);
    closeModal();
    showToast(`Unit ${unit.unit_name} is now vacant`);
    navigate('unit', { unitId });
  });
}

/* ---------- Management sections (UI-only configuration panels) ---------- */

function openManagementSection(key, title) {
  const bodies = {
    profile: () => {
      const c = Store.getCompany();
      return `
        <form id="profileForm" class="modal-form">
          <label for="cName">Company Name</label>
          <input type="text" id="cName" value="${esc(c.company_name)}" required>
          <label for="cOwner">Owner Name</label>
          <input type="text" id="cOwner" value="${esc(c.owner_name)}">
          <label for="cPhone">Phone</label>
          <input type="tel" id="cPhone" value="${esc(c.phone)}">
          <label for="cEmail">Email</label>
          <input type="email" id="cEmail" value="${esc(c.email)}">
          <button type="submit" class="btn primary full">Save Profile</button>
        </form>`;
    },
    properties: () => `
      <ul class="mgmt-list">
        ${Store.getProperties().map(p => {
          const s = Store.propertyStats(p.property_id);
          return `<li><span>${esc(p.property_name)}</span><span class="dim-text">${s.totalUnits} Units</span></li>`;
        }).join('')}
      </ul>
      <p class="dim-text">Adding and archiving Properties will be enabled with backend integration.</p>`,
    units: () => `
      <ul class="mgmt-list">
        ${Store.getProperties().map(p => {
          const s = Store.propertyStats(p.property_id);
          return `<li><span>${esc(p.property_name)}</span><span class="dim-text">${s.occupiedUnits} occupied · ${s.vacantUnits} vacant</span></li>`;
        }).join('')}
      </ul>
      <p class="dim-text">Unit and Unit Type editing will be enabled with backend integration.</p>`,
    pricing: () => `
      <ul class="mgmt-list">
        ${Store.getUnits().map(u => `<li><span>${esc(u.unit_name)} <small class="dim-text">(${esc(u.unit_type)})</small></span><span>${fmtMoney(u.rent)}</span></li>`).join('')}
      </ul>`,
    notifications: () => `
      <div class="toggle-list">
        <label class="toggle-row"><span>Rent due reminders</span><input type="checkbox" checked></label>
        <label class="toggle-row"><span>Payment received alerts</span><input type="checkbox" checked></label>
        <label class="toggle-row"><span>Vacancy alerts</span><input type="checkbox"></label>
        <label class="toggle-row"><span>Monthly report summary</span><input type="checkbox" checked></label>
      </div>
      <p class="dim-text">Delivery channels (SMS / email) will be configured with backend integration.</p>`,
    data: () => `
      <div class="action-row">
        <button class="btn primary" onclick="showToast('Export will be available with backend integration')">Export CSV</button>
        <button class="btn" onclick="showToast('Backups will be available with backend integration')">Back Up Data</button>
      </div>
      <p class="dim-text">All data currently lives in this browser session only.</p>`
  };

  openModal(title, bodies[key]());

  if (key === 'profile') {
    document.getElementById('profileForm').addEventListener('submit', e => {
      e.preventDefault();
      Object.assign(DB.company, {
        company_name: document.getElementById('cName').value.trim(),
        owner_name: document.getElementById('cOwner').value.trim(),
        phone: document.getElementById('cPhone').value.trim(),
        email: document.getElementById('cEmail').value.trim()
      });
      document.getElementById('topbarCompany').textContent = DB.company.company_name;
      closeModal();
      showToast('Company Profile saved');
      navigate('management');
    });
  }
}

/* ---------- Boot ---------- */

navigate('dashboard');
