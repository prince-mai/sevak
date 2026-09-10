// SEVAK Platform - Turnkey Project & Custom Quote Estimator
// Dynamic calculations for Civil, Construction, Aluminium/Glass, Painting & B2B

const SevakQuote = {
  activeCategory: 'civil-renovation',
  uploadedPlans: [],

  openQuoteModal(categoryId = 'civil-renovation') {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;

    this.activeCategory = categoryId;
    this.uploadedPlans = [];

    const catSelect = document.getElementById('quote-category-select');
    if (catSelect) catSelect.value = categoryId;

    this.calculateEstimate();
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeQuoteModal() {
    const modal = document.getElementById('quote-modal');
    if (modal) modal.classList.add('hidden');
  },

  calculateEstimate() {
    const category = document.getElementById('quote-category-select')?.value || 'civil-renovation';
    const areaSqFt = parseInt(document.getElementById('quote-area-input')?.value || '500', 10);
    const materialGrade = document.getElementById('quote-material-grade')?.value || 'premium';

    let baseRatePerSqFt = 45; // default
    let materialMultiplier = 1.0;

    if (materialGrade === 'standard') materialMultiplier = 0.85;
    else if (materialGrade === 'premium') materialMultiplier = 1.15;
    else if (materialGrade === 'luxury') materialMultiplier = 1.45;

    switch (category) {
      case 'civil-renovation':
        baseRatePerSqFt = 55; // dampness, plaster, tiles
        break;
      case 'construction':
        baseRatePerSqFt = 1450; // rooftop floor construction
        break;
      case 'aluminium-glass':
        baseRatePerSqFt = 275; // toughened 12mm glass & Jindal sections
        break;
      case 'painting':
        baseRatePerSqFt = 24; // Asian Paints Royal luxury emulsion
        break;
      case 'fire-safety':
        baseRatePerSqFt = 15; // hydrant + extinguisher matrix
        break;
      case 'cctv':
        baseRatePerSqFt = 22; // IP network cabling & cameras
        break;
      case 'b2b-projects':
        baseRatePerSqFt = 750; // commercial turnkey fitout
        break;
    }

    const lowEstimate = Math.round(areaSqFt * baseRatePerSqFt * materialMultiplier * 0.9);
    const highEstimate = Math.round(areaSqFt * baseRatePerSqFt * materialMultiplier * 1.15);

    const rangeDisplay = document.getElementById('quote-estimate-range-display');
    if (rangeDisplay) {
      rangeDisplay.innerHTML = `
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
          <span class="text-[11px] font-bold uppercase tracking-wider text-amber-800">Estimated Project Bracket (Patna Rates)</span>
          <div class="text-xl sm:text-2xl font-black text-amber-600 font-mono mt-1">
            ₹${lowEstimate.toLocaleString('en-IN')} - ₹${highEstimate.toLocaleString('en-IN')}
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            Includes Bihar GST (18%), labor, site engineer supervision & warranty certificate.
          </p>
        </div>
      `;
    }
  },

  handlePlanUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadedPlans.push({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
    }

    const container = document.getElementById('quote-plan-previews');
    if (container) {
      container.innerHTML = this.uploadedPlans.map(p => `
        <div class="px-2.5 py-1 bg-slate-100 rounded text-[11px] font-medium text-slate-700 flex items-center gap-1.5 border border-slate-200">
          <span>📐 ${p.name}</span>
          <span class="text-slate-400">(${p.size})</span>
        </div>
      `).join('');
    }
  },

  submitQuoteRequest(event) {
    if (event) event.preventDefault();

    const clientName = document.getElementById('quote-client-name')?.value || 'Alok Kumar';
    const clientPhone = document.getElementById('quote-client-phone')?.value || '+91 94310 12345';
    const clientLocality = document.getElementById('quote-locality-select')?.value || 'Kankarbagh, Patna';
    const category = document.getElementById('quote-category-select')?.value || 'Civil & Renovation';
    const propertyType = document.getElementById('quote-property-type')?.value || 'Independent House';
    const area = document.getElementById('quote-area-input')?.value || '500';

    const newQuote = {
      id: 'QT-' + Math.floor(600 + Math.random() * 400),
      customerName: clientName,
      contactPerson: clientName,
      phone: clientPhone,
      category: category,
      projectType: `${propertyType} (${area} sq.ft)`,
      location: clientLocality,
      estimatedValue: 'Site Inspection Scheduled',
      status: 'Survey Scheduled',
      submittedAt: new Date().toISOString(),
      notes: `Free site inspection requested for ${propertyType} at ${clientLocality}. Area: ${area} sq.ft.`
    };

    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote)
    }).catch(() => {});

    const contentEl = document.getElementById('quote-modal-content');
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <i data-lucide="file-check-2" class="w-10 h-10"></i>
          </div>
          <h3 class="text-xl font-black text-slate-900">Site Survey Request Confirmed!</h3>
          <p class="text-xs text-slate-500 mt-1">Quotation Ticket ID: <span class="font-mono font-bold text-amber-600">${newQuote.id}</span></p>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4 text-left text-xs space-y-2 max-w-md mx-auto">
            <div class="flex justify-between">
              <span class="text-slate-500">Project Type:</span>
              <span class="font-bold text-slate-800">${newQuote.projectType}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Inspection Locality:</span>
              <span class="font-bold text-slate-800">${newQuote.location}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Assigned Site Engineer:</span>
              <span class="font-bold text-emerald-600">Er. Rajesh Verma (Patna Hub)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Inspection Charges:</span>
              <span class="font-bold text-emerald-600 uppercase">100% Free Site Visit</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 max-w-sm mx-auto mt-4">
            Our Senior Project Engineer will call you within 2 business hours to confirm your convenient visit time slot with digital laser measurement tools and material samples.
          </p>

          <div class="mt-6 flex justify-center">
            <button onclick="SevakQuote.closeQuoteModal()" class="btn-primary py-2.5 px-6 text-xs font-bold">
              Done & Return to Services
            </button>
          </div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    }
  }
};
