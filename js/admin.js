// SEVAK Platform - Admin Operations Command Center Controller
// Real-time dispatching, fleet management, telemetry charts, and quote approvals

const SevakAdmin = {
  bookings: [],
  quotes: [],
  technicians: [],
  revenueChart: null,
  categoryChart: null,

  init() {
    this.bookings = [...SEVAK_DATA.technicianFleet ? [
      {
        id: 'SEV-8921',
        serviceName: 'AC Jet Cleaning & Gas Check',
        category: 'Electrical',
        customerName: 'Aman Verma',
        phone: '+91 98350 12345',
        locality: 'Boring Road',
        address: 'Flat 402, Shanti Vihar, Boring Road, Patna',
        date: 'Today, 2:30 PM',
        status: 'In-Transit',
        amount: 699,
        paymentMethod: 'UPI (PhonePe)',
        technician: 'Rakesh Kumar',
        otp: '4829'
      },
      {
        id: 'SEV-8922',
        serviceName: 'Full Bathroom Descaling & Tank Clean',
        category: 'Plumbing',
        customerName: 'Pooja Singh',
        phone: '+91 99340 55432',
        locality: 'Kankarbagh',
        address: 'House 14, Road No. 3, Kankarbagh, Patna',
        date: 'Today, 4:00 PM',
        status: 'Assigned',
        amount: 1250,
        paymentMethod: 'Cash on Service',
        technician: 'Manoj Paswan',
        otp: '7103'
      },
      {
        id: 'SEV-8923',
        serviceName: 'Termite Warranty Treatment (3 BHK)',
        category: 'Pest Control',
        customerName: 'Dr. S. K. Sinha',
        phone: '+91 94302 99881',
        locality: 'Danapur / Saguna More',
        address: 'Bailey Road, Near Saguna More, Danapur, Patna',
        date: 'Tomorrow, 10:00 AM',
        status: 'Confirmed',
        amount: 2499,
        paymentMethod: 'UPI (Google Pay)',
        technician: 'Sanjeev Kumar Sinha',
        otp: '9312'
      },
      {
        id: 'SEV-8924',
        serviceName: 'Toughened Glass Cabin Partition',
        category: 'Aluminium & Glass',
        customerName: 'Er. Rajesh Ranjan',
        phone: '+91 98351 00921',
        locality: 'Patliputra Colony',
        address: 'Plot 104, Patliputra Colony, Patna',
        date: 'Today, 5:30 PM',
        status: 'In-Transit',
        amount: 8500,
        paymentMethod: 'NetBanking / GST',
        technician: 'Rakesh Kumar',
        otp: '5519'
      }
    ] : []];

    this.quotes = [
      {
        id: 'QT-501',
        client: 'Ruban Memorial Hospital',
        contactPerson: 'Arvind Sharma (Admin)',
        phone: '+91 93340 77112',
        category: 'AMC & Turnkey',
        projectType: 'Hospital 24/7 Electrical & Plumbing AMC',
        locality: 'Patliputra Colony, Patna',
        estimatedValue: '₹ 1,80,000 / yr',
        status: 'Survey Scheduled',
        engineer: 'Er. Rajesh Verma'
      },
      {
        id: 'QT-502',
        client: 'Rameshwaram Heights RWA',
        contactPerson: 'Col. R. P. Singh (Retd.)',
        phone: '+91 98352 44109',
        category: 'Civil & Renovation',
        projectType: 'Terrace Waterproofing & Rain Drainage',
        locality: 'Rajendra Nagar, Patna',
        estimatedValue: '₹ 95,000',
        status: 'Quote Sent',
        engineer: 'Er. Alok Sharma'
      },
      {
        id: 'QT-503',
        client: 'DPS School Junior Wing',
        contactPerson: 'Mrs. Rekha Pathak',
        phone: '+91 94312 88401',
        category: 'Fire Safety & CCTV',
        projectType: '16-Channel HD IP CCTV & Fire NOC Audit',
        locality: 'Bailey Road, Patna',
        estimatedValue: '₹ 72,000',
        status: 'Work Approved',
        engineer: 'Er. Sanjeev Kumar'
      }
    ];

    this.technicians = SEVAK_DATA.technicianFleet;

    this.renderBookingsTable();
    this.renderQuotesTable();
    this.renderTechniciansTable();
    this.renderCharts();

    if (window.lucide) lucide.createIcons();
  },

  renderBookingsTable() {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.bookings.map((b, idx) => {
      let statusBadge = 'bg-amber-100 text-amber-800';
      if (b.status === 'Completed') statusBadge = 'bg-emerald-100 text-emerald-800';
      else if (b.status === 'In-Transit') statusBadge = 'bg-blue-100 text-blue-800 animate-pulse';

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
          <td class="py-3 px-4 font-mono font-bold text-slate-800">${b.id}</td>
          <td class="py-3 px-4">
            <p class="font-bold text-slate-900">${b.serviceName}</p>
            <span class="text-[10px] text-slate-400 uppercase font-semibold">${b.category}</span>
          </td>
          <td class="py-3 px-4">
            <p class="font-bold text-slate-800">${b.customerName}</p>
            <p class="text-[11px] text-slate-500">${b.phone}</p>
            <span class="text-[10px] text-amber-600 font-semibold">${b.locality}</span>
          </td>
          <td class="py-3 px-4 font-mono font-bold text-slate-900">₹${b.amount}</td>
          <td class="py-3 px-4">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-semibold text-slate-800">${b.technician}</span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono">OTP: ${b.otp}</span>
          </td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge}">
              ${b.status}
            </span>
          </td>
          <td class="py-3 px-4 text-right space-x-1">
            <button onclick="SevakAdmin.toggleBookingStatus(${idx})" class="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition" title="Cycle Status">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
            <button onclick="SevakAdmin.viewInvoiceModal(${idx})" class="p-1.5 hover:bg-slate-200 rounded text-amber-600 transition" title="Print Invoice">
              <i data-lucide="file-text" class="w-4 h-4"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  toggleBookingStatus(index) {
    const b = this.bookings[index];
    if (b.status === 'Assigned') b.status = 'In-Transit';
    else if (b.status === 'In-Transit') b.status = 'Completed';
    else b.status = 'Assigned';

    this.renderBookingsTable();
    this.showAdminToast(`Job ${b.id} updated to ${b.status}`);
  },

  viewInvoiceModal(index) {
    const b = this.bookings[index];
    SevakInvoice.renderInvoice(b);
  },

  renderQuotesTable() {
    const tbody = document.getElementById('admin-quotes-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.quotes.map(q => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
        <td class="py-3 px-4 font-mono font-bold text-slate-800">${q.id}</td>
        <td class="py-3 px-4">
          <p class="font-bold text-slate-900">${q.client}</p>
          <p class="text-[11px] text-slate-500">${q.contactPerson} • ${q.phone}</p>
        </td>
        <td class="py-3 px-4">
          <p class="font-semibold text-slate-800">${q.projectType}</p>
          <span class="text-[10px] text-amber-600">${q.locality}</span>
        </td>
        <td class="py-3 px-4 font-mono font-bold text-emerald-700">${q.estimatedValue}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            ${q.status}
          </span>
          <p class="text-[10px] text-slate-400 mt-0.5">${q.engineer}</p>
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="SevakAdmin.showAdminToast('Survey details sent to ${q.client}')" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold">
            Dispatch Engineer
          </button>
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
          <span class="text-[11px] text-slate-700 font-medium">${t.skills.join(', ')}</span>
        </td>
        <td class="py-3 px-4 font-bold text-amber-600 font-mono">${t.rating} ★</td>
        <td class="py-3 px-4 text-slate-700 font-semibold">${t.currentLocation}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
            ✓ Police Cleared
          </span>
        </td>
      </tr>
    `).join('');
  },

  renderCharts() {
    const revenueCtx = document.getElementById('adminRevenueChart')?.getContext('2d');
    const categoryCtx = document.getElementById('adminCategoryChart')?.getContext('2d');

    if (revenueCtx && window.Chart) {
      this.revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: ['Boring Rd', 'Kankarbagh', 'Bailey Rd', 'Danapur', 'Patliputra', 'Patna City', 'Rajendra Nagar'],
          datasets: [{
            label: 'Patna GMV (₹ In Thousands)',
            data: [42.5, 38.2, 29.8, 25.4, 21.0, 18.5, 16.2],
            backgroundColor: '#f59e0b',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    if (categoryCtx && window.Chart) {
      this.categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: ['Electrical', 'Plumbing', 'Pest Control', 'Civil & Reno', 'Glass & Paint', 'B2B & AMC'],
          datasets: [{
            data: [28, 22, 18, 14, 12, 6],
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#78716c', '#ec4899', '#0f172a']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  },

  exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Service,Category,Customer,Phone,Locality,Amount,Technician,Status\n";
    this.bookings.forEach(b => {
      csvContent += `${b.id},"${b.serviceName}","${b.category}","${b.customerName}","${b.phone}","${b.locality}",${b.amount},"${b.technician}","${b.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SEVAK_Patna_Bookings_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.showAdminToast("Bookings exported to CSV!");
  },

  showAdminToast(msg) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700`;
    toast.innerHTML = `<span>⚡</span><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  SevakAdmin.init();
});
