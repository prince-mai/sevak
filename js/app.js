// SEVAK Platform - Central App Controller
// Handles localization, search filtering, services rendering, and mobile simulator

const SevakApp = {
  currentLang: 'en',
  currentCategoryFilter: 'all',
  currentArea: 'Boring Road',

  isValidName(name) {
    return typeof name === 'string' && name.trim().length >= 2;
  },

  isValidPhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      return /^[6-9]\d{9}$/.test(digits.slice(2));
    }
    return /^[6-9]\d{9}$/.test(digits);
  },

  normalizePhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    const ten = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    return '+91 ' + ten;
  },

  init() {
    this.renderHeaderLocalities();
    this.renderServicesGrid();
    this.renderTestimonials();
    SevakBooking.init();
    SevakQuote.captureTemplate();
    SevakAMC.renderPlans();
    SevakProject.renderProjectDashboard();
    this.syncSearchPlaceholder();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'mobile') {
      this.toggleMobileFrame(true);
    }

    if (window.lucide) lucide.createIcons();
  },

  setLanguage(lang) {
    this.currentLang = lang;
    const body = document.body;
    if (lang === 'hi') {
      body.classList.add('lang-hindi');
    } else {
      body.classList.remove('lang-hindi');
    }

    // Toggle active state on buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('bg-amber-500', 'text-white');
        btn.classList.remove('text-slate-600');
      } else {
        btn.classList.remove('bg-amber-500', 'text-white');
        btn.classList.add('text-slate-600');
      }
    });

    // Translate marked DOM elements
    const i18n = SEVAK_I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (i18n[key]) {
        el.innerText = i18n[key];
      }
    });

    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
    });
    this.renderServicesGrid();
    this.syncSearchPlaceholder();
  },

  renderHeaderLocalities() {
    const select = document.getElementById('global-area-select');
    if (!select) return;

    select.innerHTML = SEVAK_DATA.patnaLocalities.map(loc => `
      <option value="${loc.name}">${loc.name} (Patna)</option>
    `).join('') + `
      <optgroup label="Other Bihar Districts">
        ${SEVAK_DATA.biharDistricts.slice(1).map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
      </optgroup>
    `;

    this.updateAreaAvailability(SEVAK_DATA.patnaLocalities[0].name);
  },

  onAreaChange(localityName) {
    this.currentArea = localityName;
    this.updateAreaAvailability(localityName);
  },

  updateAreaAvailability(areaName) {
    const banner = document.getElementById('area-live-status-pill');
    if (!banner) return;

    const loc = SEVAK_DATA.patnaLocalities.find(l => l.name === areaName);
    if (loc) {
      banner.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Serving <b>${loc.name}</b> • Typical first-response window about <b>${loc.avgEtaMinutes} mins</b> (estimate)</span>
      `;
    } else {
      banner.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Serving <b>${areaName}</b> — book a slot or call the helpline to confirm timing</span>
      `;
    }
  },

  filterServices(filterCategory, buttonEl) {
    this.currentCategoryFilter = filterCategory;

    // Update filter button tabs
    document.querySelectorAll('.svc-filter-pill').forEach(btn => {
      btn.classList.remove('bg-amber-500', 'text-white');
      btn.classList.add('bg-slate-100', 'text-slate-700');
    });
    if (buttonEl) {
      buttonEl.classList.add('bg-amber-500', 'text-white');
      buttonEl.classList.remove('bg-slate-100', 'text-slate-700');
    }

    this.renderServicesGrid();
  },

  onSearchServices(keyword) {
    const input = document.getElementById('hero-service-search');
    if (input && input.value !== keyword) input.value = keyword;
    this.renderServicesGrid(keyword.toLowerCase().trim());
  },

  renderServicesGrid(searchQuery = '') {
    const container = document.getElementById('services-cards-grid');
    if (!container) return;

    let filtered = SEVAK_DATA.services;

    // Category filter logic
    if (this.currentCategoryFilter === 'emergency') {
      filtered = filtered.filter(s => ['electrical', 'plumbing'].includes(s.id));
    } else if (this.currentCategoryFilter === 'renovation') {
      filtered = filtered.filter(s => ['civil-renovation', 'construction', 'aluminium-glass', 'painting'].includes(s.id));
    } else if (this.currentCategoryFilter === 'safety') {
      filtered = filtered.filter(s => ['pest-control', 'fire-safety', 'cctv', 'cleaning'].includes(s.id));
    } else if (this.currentCategoryFilter === 'b2b') {
      filtered = filtered.filter(s => ['b2b-projects', 'amc', 'advertising'].includes(s.id));
    }

    // Keyword search filter
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery) ||
        s.description.toLowerCase().includes(searchQuery) ||
        s.subservices.some(sub => sub.name.toLowerCase().includes(searchQuery))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-slate-400 text-sm font-medium">No services found matching "${searchQuery}".</p>
          <button onclick="SevakQuote.openQuoteModal()" class="mt-3 text-xs font-bold text-amber-600 underline">
            Request a custom quotation instead →
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(svc => {
      const isHindi = this.currentLang === 'hi';
      const displayName = isHindi ? svc.nameHindi : svc.name;
      const displaySecondary = isHindi ? svc.name : svc.nameHindi;

      return `
        <div class="glass-card rounded-2xl p-5 md:p-6 flex flex-col justify-between border border-slate-100/80 hover:border-amber-400/50 transition-all duration-300">
          <div>
            <!-- Top Row: Icon & Badge -->
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} text-white flex items-center justify-center shadow-md">
                <i data-lucide="${svc.icon}" class="w-6 h-6"></i>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200/60">
                ${svc.badge}
              </span>
            </div>

            <!-- Title & Description -->
            <div class="mt-4">
              <h3 class="text-base md:text-lg font-bold text-slate-900 leading-snug">${displayName}</h3>
              <p class="text-[11px] text-amber-600 font-semibold">${displaySecondary}</p>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2">${svc.description}</p>
            </div>

            <!-- Top Subservices Preview -->
            <div class="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              ${svc.subservices.slice(0, 3).map(sub => `
                <div class="flex items-center justify-between text-xs py-0.5">
                  <span class="text-slate-700 truncate max-w-[170px]">• ${sub.name}</span>
                  <span class="font-mono font-bold text-slate-900 shrink-0">₹${sub.price}${sub.unit ? ' ' + sub.unit : ''}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button onclick="SevakBooking.openBooking('${svc.id}')"
              class="btn-primary py-2 px-3 text-xs font-bold flex items-center justify-center gap-1">
              <span>Book</span>
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="SevakQuote.openQuoteModal('${svc.id}')"
              class="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1">
              <span>Quote</span>
              <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  renderTestimonials() {
    const container = document.getElementById('testimonials-grid');
    if (!container) return;

    container.innerHTML = SEVAK_DATA.testimonials.map(t => `
      <div class="glass-card rounded-2xl p-6 border border-slate-100 relative">
        <div class="flex items-center gap-3">
          <img src="${t.avatar}" class="w-12 h-12 rounded-full object-cover border-2 border-amber-400" alt="${t.name}"/>
          <div>
            <h4 class="font-bold text-sm text-slate-900">${t.name}</h4>
            <p class="text-xs text-slate-500">${t.designation} • <span class="text-amber-700 font-semibold">${t.locality}</span></p>
          </div>
        </div>

        <div class="flex items-center gap-1 mt-3 text-amber-500 text-xs">
          ${'★'.repeat(t.rating)}
          <span class="text-[11px] text-slate-400 ml-1">(${t.date})</span>
        </div>

        <p class="text-xs text-slate-600 mt-2 leading-relaxed">"${t.review}"</p>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span class="font-semibold text-slate-700">Service: ${t.service}</span>
          <span class="text-slate-400 font-semibold">Illustrative story</span>
        </div>
      </div>
    `).join('');
  },

  toggleMobileFrame(forceState = null) {
    const container = document.getElementById('app-viewport-container');
    const toggleBtn = document.getElementById('toggle-mobile-preview-btn');
    if (!container) return;

    const isCurrentlyMobile = container.classList.contains('mode-mobile-frame');
    const targetState = forceState !== null ? forceState : !isCurrentlyMobile;

    if (targetState) {
      container.classList.add('mode-mobile-frame');
      if (toggleBtn) {
        toggleBtn.innerHTML = `<i data-lucide="monitor" class="w-4 h-4"></i> Switch to Desktop View`;
      }
      this.showToast('📱 Switched to Mobile App Simulator (Patna Mobile View)');
    } else {
      container.classList.remove('mode-mobile-frame');
      if (toggleBtn) {
        toggleBtn.innerHTML = `<i data-lucide="smartphone" class="w-4 h-4"></i> Preview Mobile App View`;
      }
      this.showToast('💻 Switched to Full Desktop Portal View');
    }

    if (window.lucide) lucide.createIcons();
  },

  triggerEmergencyBooking() {
    SevakBooking.openBooking('electrical');
    setTimeout(() => {
      const expressCheckbox = document.getElementById('express-toggle-checkbox');
      if (expressCheckbox) {
        expressCheckbox.checked = true;
        SevakBooking.toggleExpress(true);
      }
    }, 200);
  },

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 transition-all transform duration-300 translate-y-4 opacity-0`;
    toast.innerHTML = `<span>${message}</span>`;
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  SevakApp.init();
});
