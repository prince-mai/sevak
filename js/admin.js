// SEVAK Platform - Admin Operations Command Center
// Uses real bookings/quotes from API + browser storage (no fake KPIs)

const SevakAdmin = {
  bookings: [],
  quotes: [],
  technicians: [],
  filterQuery: '',
  revenueChart: null,
  categoryChart: null,

  async init() {
    this.technicians = SEVAK_DATA.technicianFleet || [];
    this.bookings = this.normalizeBookings(SevakStore.getBookings());
    this.quotes = this.normalizeQuotes(SevakStore.getQuotes());

    const [apiBookings, apiQuotes] = await Promise.all([
      SevakStore.fetchJson('/api/bookings'),
      SevakStore.fetchJson('/api/quotes')
    ]);
    if (Array.isArray(apiBookings)) {
      this.bookings = this.mergeById(this.normalizeBookings(apiBookings), this.bookings);
    }
    if (Array.isArray(apiQuotes)) {
      this.quotes = this.mergeById(this.normalizeQuotes(apiQuotes), this.quotes);
    }

    this.renderKpis();
    this.renderBookingsTable();
    this.renderQuotesTable();
    this.renderTechniciansTable();
    this.renderCharts();

    const filter = document.getElementById('admin-booking-filter');
    if (filter) {
      filter.addEventListener('input', () => {
        this.filterQuery = filter.value.trim().toLowerCase();
        this.renderBookingsTable();
      });
    }

    if (window.lucide) lucide.createIcons();
  },

  mergeById(primary, secondary) {
    const map = new Map();
    [...secondary, ...primary].forEach(item => {
      if (item && item.id) map.set(item.id, item);
    });
    return [...map.values()].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  },

  normalizeBookings(list) {
    return (list || []).map(b => ({
      ...b,
      locality: b.locality || b.area || '',
      technicianName: typeof b.technician === 'string'
        ? b.technician
        : (b.technician && b.technician.name) || 'To be assigned',
      technician: typeof b.technician === 'object' && b.technician
        ? b.technician
        : { name: b.technician || 'To be assigned', phone: SEVAK_DATA.brand.phone, badge: 'SEVAK Partner' }
    }));
  },

  normalizeQuotes(list) {
    return (list || []).map(q => ({
      ...q,
      client: q.client || q.customerName || '—',
      contactPerson: q.contactPerson || q.customerName || '—',
      locality: q.locality || q.location || '—',
      engineer: q.engineer || 'To be assigned'
    }));
  },

  renderKpis() {
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    const today = new Date().toISOString().slice(0, 10);
    const todayBookings = this.bookings.filter(b => (b.createdAt || '').slice(0, 10) === today);
    const gmv = this.bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    set('kpi-bookings', String(todayBookings.length || this.bookings.length));
    set('kpi-bookings-sub', `${this.bookings.length} stored locally / server`);
    set('kpi-quotes', String(this.quotes.length));
    set('kpi-gmv', '₹' + gmv.toLocaleString('en-IN'));
    set('kpi-fleet', String(this.technicians.length));
  },

  visibleBookings() {
    if (!this.filterQuery) return this.bookings;
    const q = this.filterQuery;
    return this.bookings.filter(b =>
      [b.id, b.serviceName, b.customerName, b.phone, b.locality, b.status]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  },

  renderBookingsTable() {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;
    const rows = this.visibleBookings();
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 px-4 text-center text-slate-400 text-xs">No bookings yet. New website requests will appear here.</td></tr>`;
      return;
    }

    tbody.innerHTML = rows.map((b, idx) => {
      let statusBadge = 'bg-amber-100 text-amber-800';
      if (b.status === 'Completed') statusBadge = 'bg-emerald-100 text-emerald-800';
      else if (b.status === 'In-Transit') statusBadge = 'bg-blue-100 text-blue-800';
      else if (b.status === 'Received') statusBadge = 'bg-slate-100 text-slate-700';

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
          <td class="py-3 px-4 font-mono font-bold text-slate-800">${b.id}</td>
          <td class="py-3 px-4">
            <p class="font-bold text-slate-900">${b.serviceName || '—'}</p>
            <span class="text-[10px] text-slate-400 uppercase font-semibold">${b.category || ''}</span>
          </td>
          <td class="py-3 px-4">
            <p class="font-bold text-slate-800">${b.customerName || '—'}</p>
            <p class="text-[11px] text-slate-500">${b.phone || ''}</p>
            <span class="text-[10px] text-amber-600 font-semibold">${b.locality || ''}</span>
          </td>
          <td class="py-3 px-4 font-mono font-bold text-slate-900">₹${b.amount || 0}</td>
          <td class="py-3 px-4">
            <span class="font-semibold text-slate-800">${b.technicianName}</span>
          </td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge}">${b.status || 'Received'}</span>
          </td>
          <td class="py-3 px-4 text-right space-x-1">
            <button type="button" onclick="SevakAdmin.toggleBookingStatus(${idx})" class="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition" title="Cycle Status" aria-label="Update status">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
            <button type="button" onclick="SevakAdmin.viewInvoiceModal(${idx})" class="p-1.5 hover:bg-slate-200 rounded text-amber-600 transition" title="Print Invoice" aria-label="View invoice">
              <i data-lucide="file-text" class="w-4 h-4"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  toggleBookingStatus(index) {
    const rows = this.visibleBookings();
    const b = rows[index];
    if (!b) return;
    if (b.status === 'Received' || b.status === 'Confirmed' || b.status === 'Assigned') b.status = 'In-Transit';
    else if (b.status === 'In-Transit') b.status = 'Completed';
    else b.status = 'Received';
    SevakStore.updateBooking(b.id, { status: b.status });
    this.renderBookingsTable();
    this.showAdminToast(`Job ${b.id} updated to ${b.status}`);
  },

  viewInvoiceModal(index) {
    const b = this.visibleBookings()[index];
    if (b) SevakInvoice.renderInvoice(b);
  },

  renderQuotesTable() {
    const tbody = document.getElementById('admin-quotes-tbody');
    if (!tbody) return;
    if (!this.quotes.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-8 px-4 text-center text-slate-400 text-xs">No quote requests yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.quotes.map(q => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
        <td class="py-3 px-4 font-mono font-bold text-slate-800">${q.id}</td>
        <td class="py-3 px-4">
          <p class="font-bold text-slate-900">${q.client}</p>
          <p class="text-[11px] text-slate-500">${q.contactPerson} • ${q.phone || ''}</p>
        </td>
        <td class="py-3 px-4">
          <p class="font-semibold text-slate-800">${q.projectType || q.category}</p>
          <span class="text-[10px] text-amber-600">${q.locality}</span>
        </td>
        <td class="py-3 px-4 font-mono font-bold text-emerald-700">${q.estimatedValue || '—'}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">${q.status}</span>
        </td>
        <td class="py-3 px-4 text-right">
          <a href="tel:${(q.phone || SEVAK_DATA.brand.callTo).replace(/\s/g, '')}" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold inline-block">
            Call client
          </a>
        </td>
      </tr>
    `).join('');
  },

  renderTechniciansTable() {
    const tbody = document.getElementById('admin-technicians-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.technicians.map(t => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
        <td class="py-3 px-4 font-mono font-bold text-slate-800">${t.id}</td>
        <td class="py-3 px-4">
          <p class="font-bold text-slate-900">${t.name}</p>
          <p class="text-[11px] text-slate-500">${t.phone}</p>
        </td>
        <td class="py-3 px-4">
          <span class="text-[11px] text-slate-700 font-medium">${(t.skills || []).join(', ')}</span>
        </td>
        <td class="py-3 px-4 font-bold text-amber-600 font-mono">${t.rating} ★</td>
        <td class="py-3 px-4 text-slate-700 font-semibold">${t.currentLocation}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[10px]">Roster sample</span>
        </td>
      </tr>
    `).join('');
  },

  renderCharts() {
    const revenueCtx = document.getElementById('adminRevenueChart')?.getContext('2d');
    const categoryCtx = document.getElementById('adminCategoryChart')?.getContext('2d');
    if (!window.Chart) return;

    const byArea = {};
    this.bookings.forEach(b => {
      const key = (b.locality || b.area || 'Patna').split(',')[0];
      byArea[key] = (byArea[key] || 0) + (Number(b.amount) || 0);
    });
    const areaLabels = Object.keys(byArea);
    const areaData = Object.values(byArea).map(v => Math.round(v / 100) / 10);

    if (revenueCtx) {
      if (this.revenueChart) this.revenueChart.destroy();
      this.revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: areaLabels.length ? areaLabels : ['No bookings yet'],
          datasets: [{
            label: 'GMV (₹ thousands)',
            data: areaData.length ? areaData : [0],
            backgroundColor: '#f59e0b',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const byCat = {};
    this.bookings.forEach(b => {
      const key = b.category || 'Other';
      byCat[key] = (byCat[key] || 0) + 1;
    });

    if (categoryCtx) {
      if (this.categoryChart) this.categoryChart.destroy();
      this.categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(byCat).length ? Object.keys(byCat) : ['No data'],
          datasets: [{
            data: Object.keys(byCat).length ? Object.values(byCat) : [1],
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#78716c', '#ec4899', '#0f172a']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  },

  exportCSV() {
    if (!this.bookings.length) {
      this.showAdminToast('No bookings to export.');
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Service,Category,Customer,Phone,Locality,Amount,Technician,Status\n';
    this.bookings.forEach(b => {
      csvContent += `${b.id},"${b.serviceName || ''}","${b.category || ''}","${b.customerName || ''}","${b.phone || ''}","${b.locality || ''}",${b.amount || 0},"${b.technicianName || ''}","${b.status || ''}"\n`;
    });
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `SEVAK_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.showAdminToast('Bookings exported to CSV.');
  },

  showAdminToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl border border-slate-700';
    toast.setAttribute('role', 'status');
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  SevakAdmin.init();
});
