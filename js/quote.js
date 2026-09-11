// SEVAK Platform - Turnkey Project & Custom Quote Estimator

const SevakQuote = {
  activeCategory: 'civil-renovation',
  uploadedPlans: [],
  formTemplate: null,

  captureTemplate() {
    const contentEl = document.getElementById('quote-modal-content');
    if (contentEl && !this.formTemplate) {
      this.formTemplate = contentEl.innerHTML;
    }
  },

  openQuoteModal(categoryId = 'civil-renovation') {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;

    this.captureTemplate();
    const contentEl = document.getElementById('quote-modal-content');
    if (contentEl && this.formTemplate && !document.getElementById('quote-client-name')) {
      contentEl.innerHTML = this.formTemplate;
      if (window.lucide) lucide.createIcons();
    }

    this.activeCategory = categoryId;
    this.uploadedPlans = [];

    const catSelect = document.getElementById('quote-category-select');
    if (catSelect) {
      const hasOption = [...catSelect.options].some(o => o.value === categoryId);
      catSelect.value = hasOption ? categoryId : 'civil-renovation';
    }

    ['quote-client-name', 'quote-client-phone', 'quote-area-input'].forEach(id => {
      const err = document.getElementById(id + '-error');
      if (err) err.textContent = '';
      const field = document.getElementById(id);
      if (field) field.classList.remove('input-invalid');
    });

    this.calculateEstimate();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (window.lucide) lucide.createIcons();
  },

  closeQuoteModal() {
    const modal = document.getElementById('quote-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  },

  calculateEstimate() {
    const category = document.getElementById('quote-category-select')?.value || 'civil-renovation';
    const areaSqFt = parseInt(document.getElementById('quote-area-input')?.value || '500', 10);
    const materialGrade = document.getElementById('quote-material-grade')?.value || 'premium';

    let baseRatePerSqFt = 45;
    let materialMultiplier = 1.0;

    if (materialGrade === 'standard') materialMultiplier = 0.85;
    else if (materialGrade === 'premium') materialMultiplier = 1.15;
    else if (materialGrade === 'luxury') materialMultiplier = 1.45;

    switch (category) {
      case 'civil-renovation':
        baseRatePerSqFt = 55;
        break;
      case 'construction':
        baseRatePerSqFt = 1450;
        break;
      case 'aluminium-glass':
        baseRatePerSqFt = 275;
        break;
      case 'painting':
        baseRatePerSqFt = 24;
        break;
      case 'fire-safety':
        baseRatePerSqFt = 15;
        break;
      case 'cctv':
        baseRatePerSqFt = 22;
        break;
      case 'b2b-projects':
        baseRatePerSqFt = 750;
        break;
      case 'amc':
        baseRatePerSqFt = 8;
        break;
    }

    const safeArea = Number.isFinite(areaSqFt) && areaSqFt > 0 ? areaSqFt : 0;
    const lowEstimate = Math.round(safeArea * baseRatePerSqFt * materialMultiplier * 0.9);
    const highEstimate = Math.round(safeArea * baseRatePerSqFt * materialMultiplier * 1.15);

    const rangeDisplay = document.getElementById('quote-estimate-range-display');
    if (rangeDisplay) {
      rangeDisplay.innerHTML = `
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
          <span class="text-[11px] font-bold uppercase tracking-wider text-amber-800">Indicative Patna rate bracket</span>
          <div class="text-xl sm:text-2xl font-black text-amber-600 font-mono mt-1">
            ₹${lowEstimate.toLocaleString('en-IN')} - ₹${highEstimate.toLocaleString('en-IN')}
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            Estimate only. Final quote after a free site visit. GST extra as applicable.
          </p>
        </div>
      `;
    }
  },

  handlePlanUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length && this.uploadedPlans.length < 5; i++) {
      const file = files[i];
      if (file.size > 25 * 1024 * 1024) {
        SevakApp.showToast('Each plan/photo must be under 25 MB.');
        continue;
      }
      this.uploadedPlans.push({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
    }

    const container = document.getElementById('quote-plan-previews');
    if (container) {
      container.innerHTML = this.uploadedPlans.map(p => `
        <div class="px-2.5 py-1 bg-slate-100 rounded text-[11px] font-medium text-slate-700 flex items-center gap-1.5 border border-slate-200">
          <span>${p.name}</span>
          <span class="text-slate-400">(${p.size})</span>
        </div>
      `).join('');
    }
  },

  submitQuoteRequest(event) {
    if (event) event.preventDefault();

    const nameEl = document.getElementById('quote-client-name');
    const phoneEl = document.getElementById('quote-client-phone');
    const areaEl = document.getElementById('quote-area-input');
    const clientName = nameEl?.value.trim() || '';
    const clientPhone = phoneEl?.value.trim() || '';
    const area = parseInt(areaEl?.value || '0', 10);

    let ok = true;
    const setErr = (id, msg) => {
      const err = document.getElementById(id + '-error');
      const field = document.getElementById(id);
      if (err) err.textContent = msg || '';
      if (field) {
        field.classList.toggle('input-invalid', Boolean(msg));
        field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      }
    };

    if (!SevakApp.isValidName(clientName)) {
      setErr('quote-client-name', 'Please enter your name.');
      ok = false;
    } else setErr('quote-client-name', '');

    if (!SevakApp.isValidPhone(clientPhone)) {
      setErr('quote-client-phone', 'Enter a valid 10-digit Indian mobile number.');
      ok = false;
    } else setErr('quote-client-phone', '');

    if (!Number.isFinite(area) || area < 50) {
      setErr('quote-area-input', 'Enter a realistic area (minimum 50 sq.ft).');
      ok = false;
    } else setErr('quote-area-input', '');

    if (!ok) return;

    const clientLocality = document.getElementById('quote-locality-select')?.value || 'Patna';
    const category = document.getElementById('quote-category-select')?.value || 'civil-renovation';
    const propertyType = document.getElementById('quote-property-type')?.value || 'Independent House';
    const catLabel = document.getElementById('quote-category-select')?.selectedOptions[0]?.text || category;

    const newQuote = {
      id: 'QT-' + Date.now().toString().slice(-6),
      customerName: clientName,
      contactPerson: clientName,
      phone: SevakApp.normalizePhone(clientPhone),
      category: catLabel,
      projectType: `${propertyType} (${area} sq.ft)`,
      location: clientLocality,
      estimatedValue: 'Site inspection requested',
      status: 'New request',
      submittedAt: new Date().toISOString(),
      notes: `Site inspection requested for ${propertyType} at ${clientLocality}. Area: ${area} sq.ft. Files: ${this.uploadedPlans.length}`
    };

    SevakStore.addQuote(newQuote);

    const waText = `Hello SEVAK, I need a site survey. Quote ID: ${newQuote.id}. Name: ${clientName}, Phone: ${newQuote.phone}, Type: ${newQuote.projectType}, Locality: ${clientLocality}, Category: ${catLabel}.`;

    const contentEl = document.getElementById('quote-modal-content');
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <i data-lucide="file-check-2" class="w-10 h-10"></i>
          </div>
          <h3 class="text-xl font-black text-slate-900">Survey request sent</h3>
          <p class="text-xs text-slate-500 mt-1">Ticket ID: <span class="font-mono font-bold text-amber-600">${newQuote.id}</span></p>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4 text-left text-xs space-y-2 max-w-md mx-auto">
            <div class="flex justify-between gap-2">
              <span class="text-slate-500">Project</span>
              <span class="font-bold text-slate-800 text-right">${newQuote.projectType}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-slate-500">Locality</span>
              <span class="font-bold text-slate-800 text-right">${newQuote.location}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Visit charge</span>
              <span class="font-bold text-emerald-600">Free site visit</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 max-w-sm mx-auto mt-4">
            We will call this number to fix a visit slot. Send the same details on WhatsApp if you prefer a faster response.
          </p>

          <div class="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a href="${SevakStore.whatsappHref(waText)}" target="_blank" rel="noopener noreferrer" class="btn-primary py-2.5 px-6 text-xs font-bold">
              Send on WhatsApp
            </a>
            <button type="button" onclick="SevakQuote.closeQuoteModal()" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
              Done
            </button>
          </div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    }
  }
};
