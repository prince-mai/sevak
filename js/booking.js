// SEVAK Platform - Interactive Service Booking Engine
// Multi-step modal with media upload, transparent billing, and WhatsApp handoff

const SevakBooking = {
  currentStep: 1,
  selectedCategory: null,
  selectedSubservice: null,
  uploadedFiles: [],
  discountAmount: 0,
  isExpress: false,
  lastCreatedBooking: null,

  init() {
    const areaSelect = document.getElementById('book-area-select');
    if (areaSelect) {
      areaSelect.innerHTML = SEVAK_DATA.patnaLocalities
        .map(loc => `<option value="${loc.name}">${loc.name}</option>`)
        .join('') + SEVAK_DATA.biharDistricts.slice(1).map(d =>
          `<option value="${d.name}">${d.name}</option>`
        ).join('');
    }
    this.lastCreatedBooking = (window.SevakStore && SevakStore.lastBooking()) || null;
  },

  setFieldError(id, message) {
    const field = document.getElementById(id);
    const err = document.getElementById(id + '-error');
    if (field) {
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      field.classList.toggle('input-invalid', Boolean(message));
    }
    if (err) err.textContent = message || '';
  },

  openFromSearch() {
    const q = (document.getElementById('hero-service-search')?.value || '').toLowerCase().trim();
    if (!q) {
      this.openBooking('electrical');
      return;
    }
    const match = SEVAK_DATA.services.find(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.subservices.some(sub => sub.name.toLowerCase().includes(q))
    );
    this.openBooking(match ? match.id : 'electrical');
  },

  openBooking(categoryId = 'electrical', subserviceId = null) {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    this.currentStep = 1;
    this.uploadedFiles = [];
    this.discountAmount = 0;
    this.isExpress = false;

    this.selectedCategory = SEVAK_DATA.services.find(s => s.id === categoryId) || SEVAK_DATA.services[0];
    if (subserviceId) {
      this.selectedSubservice = this.selectedCategory.subservices.find(sub => sub.id === subserviceId) || this.selectedCategory.subservices[0];
    } else {
      this.selectedSubservice = this.selectedCategory.subservices[0];
    }

    const areaSelect = document.getElementById('book-area-select');
    if (areaSelect && window.SevakApp && SevakApp.currentArea) {
      const opt = [...areaSelect.options].find(o => o.value === SevakApp.currentArea);
      if (opt) areaSelect.value = SevakApp.currentArea;
    }

    const express = document.getElementById('express-toggle-checkbox');
    if (express) express.checked = false;

    ['book-customer-name', 'book-customer-phone', 'book-customer-address', 'book-coupon-code'].forEach(id => {
      this.setFieldError(id, '');
    });

    this.renderCategoryOptions();
    this.renderSubserviceList();
    this.renderUploadedFiles();
    this.goToStep(1);

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('button[aria-label="Close booking"]');
    if (closeBtn) closeBtn.focus();
    if (window.lucide) lucide.createIcons();
  },

  closeBooking() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  },

  renderCategoryOptions() {
    const container = document.getElementById('book-category-pills');
    if (!container) return;

    container.innerHTML = SEVAK_DATA.services.map(svc => `
      <button type="button" onclick="SevakBooking.selectCategory('${svc.id}')"
        class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
          this.selectedCategory.id === svc.id
            ? 'bg-amber-500 text-white border-amber-500'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        }">
        ${svc.name}
      </button>
    `).join('');
  },

  selectCategory(categoryId) {
    this.selectedCategory = SEVAK_DATA.services.find(s => s.id === categoryId);
    this.selectedSubservice = this.selectedCategory.subservices[0];
    this.renderCategoryOptions();
    this.renderSubserviceList();
    this.updateBillSummary();
  },

  renderSubserviceList() {
    const listContainer = document.getElementById('book-subservice-list');
    if (!listContainer) return;

    listContainer.innerHTML = this.selectedCategory.subservices.map(sub => `
      <div onclick="SevakBooking.selectSubservice('${sub.id}')"
        role="button" tabindex="0"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();SevakBooking.selectSubservice('${sub.id}')}"
        class="p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
          this.selectedSubservice.id === sub.id
            ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        }">
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-sm text-slate-900">${sub.name}</h4>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">${sub.warranty || 'Verified'}</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Est. Time: ${sub.time} • Certified technician</p>
        </div>
        <div class="text-right">
          <p class="font-black text-amber-600 text-sm">₹${sub.price}${sub.unit ? ' ' + sub.unit : ''}</p>
          <span class="text-[11px] font-semibold text-slate-400">Select</span>
        </div>
      </div>
    `).join('');
  },

  selectSubservice(subId) {
    this.selectedSubservice = this.selectedCategory.subservices.find(s => s.id === subId);
    this.renderSubserviceList();
    this.updateBillSummary();
  },

  goToStep(stepNumber) {
    if (stepNumber === 3 && !this.validateDetails()) return;

    this.currentStep = stepNumber;

    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`booking-step-${i}`);
      const indicatorEl = document.getElementById(`step-indicator-${i}`);
      if (stepEl) {
        if (i === stepNumber) stepEl.classList.remove('hidden');
        else stepEl.classList.add('hidden');
      }
      if (indicatorEl) {
        if (i <= stepNumber) {
          indicatorEl.classList.add('bg-amber-500', 'text-white');
          indicatorEl.classList.remove('bg-slate-200', 'text-slate-600');
        } else {
          indicatorEl.classList.remove('bg-amber-500', 'text-white');
          indicatorEl.classList.add('bg-slate-200', 'text-slate-600');
        }
      }
    }

    if (stepNumber === 3) this.updateBillSummary();
    if (window.lucide) lucide.createIcons();
  },

  validateDetails() {
    const name = document.getElementById('book-customer-name')?.value.trim() || '';
    const phone = document.getElementById('book-customer-phone')?.value.trim() || '';
    const address = document.getElementById('book-customer-address')?.value.trim() || '';
    let ok = true;

    if (!SevakApp.isValidName(name)) {
      this.setFieldError('book-customer-name', 'Please enter your full name (at least 2 characters).');
      ok = false;
    } else this.setFieldError('book-customer-name', '');

    if (!SevakApp.isValidPhone(phone)) {
      this.setFieldError('book-customer-phone', 'Enter a valid 10-digit Indian mobile number.');
      ok = false;
    } else this.setFieldError('book-customer-phone', '');

    if (address.length < 8) {
      this.setFieldError('book-customer-address', 'Enter house/flat number and a nearby landmark.');
      ok = false;
    } else this.setFieldError('book-customer-address', '');

    if (!ok) this.goToStepVisible(2);
    return ok;
  },

  goToStepVisible(stepNumber) {
    this.currentStep = stepNumber;
    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`booking-step-${i}`);
      if (stepEl) stepEl.classList.toggle('hidden', i !== stepNumber);
    }
  },

  handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remaining = 5 - this.uploadedFiles.length;
    const maxBytes = 8 * 1024 * 1024;

    for (let i = 0; i < files.length && i < remaining; i++) {
      const file = files[i];
      if (file.size > maxBytes) {
        SevakApp.showToast('Each file must be under 8 MB.');
        continue;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedFiles.push({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type,
          dataUrl: e.target.result
        });
        this.renderUploadedFiles();
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  },

  renderUploadedFiles() {
    const container = document.getElementById('uploaded-media-previews');
    if (!container) return;

    if (this.uploadedFiles.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-400 text-center py-2">Optional photos help the technician bring the right parts.</p>`;
      return;
    }

    container.innerHTML = this.uploadedFiles.map((f, idx) => `
      <div class="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-1 flex items-center gap-2">
        ${f.type.startsWith('image/')
          ? `<img src="${f.dataUrl}" class="w-10 h-10 object-cover rounded" alt=""/>`
          : `<div class="w-10 h-10 bg-slate-200 rounded flex items-center justify-center text-xs">VID</div>`
        }
        <div class="truncate text-[11px] flex-1">
          <p class="font-medium text-slate-700 truncate">${f.name}</p>
          <span class="text-slate-400 text-[10px]">${f.size}</span>
        </div>
        <button type="button" onclick="SevakBooking.removeFile(${idx})" class="p-1 text-red-500 hover:bg-red-50 rounded" aria-label="Remove file">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  removeFile(index) {
    this.uploadedFiles.splice(index, 1);
    this.renderUploadedFiles();
  },

  toggleExpress(checked) {
    this.isExpress = checked;
    this.updateBillSummary();
  },

  applyCoupon() {
    const couponInput = document.getElementById('book-coupon-code');
    const couponMsg = document.getElementById('book-coupon-msg');
    if (!couponInput) return;

    const code = couponInput.value.trim().toUpperCase();
    if (code === 'PATNAFIRST' || code === 'SEVAK100') {
      this.discountAmount = 100;
      if (couponMsg) couponMsg.innerHTML = `<span class="text-emerald-600 font-bold">Coupon applied: ₹100 off.</span>`;
    } else if (!code) {
      this.discountAmount = 0;
      if (couponMsg) couponMsg.innerHTML = `<span class="text-slate-400">Optional. Try PATNAFIRST for ₹100 off.</span>`;
    } else {
      this.discountAmount = 0;
      if (couponMsg) couponMsg.innerHTML = `<span class="text-red-500 font-bold">This code is not valid.</span>`;
    }
    this.updateBillSummary();
  },

  computeTotals() {
    const subtotal = this.selectedSubservice ? this.selectedSubservice.price : 0;
    const expressFee = this.isExpress ? 99 : 0;
    const safetySanitization = 49;
    const discount = this.discountAmount;
    const taxableTotal = Math.max(subtotal + expressFee + safetySanitization - discount, 0);
    const gst = Math.round(taxableTotal * 0.18);
    return { subtotal, expressFee, safetySanitization, discount, gst, finalPayable: taxableTotal + gst };
  },

  updateBillSummary() {
    if (!this.selectedSubservice) return;
    const t = this.computeTotals();
    const summaryEl = document.getElementById('booking-bill-breakdown');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="space-y-2 text-xs text-slate-600">
          <div class="flex justify-between">
            <span>${this.selectedSubservice.name}</span>
            <span class="font-medium text-slate-800 font-mono">₹${t.subtotal}</span>
          </div>
          ${t.expressFee ? `
            <div class="flex justify-between text-amber-600 font-medium">
              <span>Priority dispatch fee</span>
              <span class="font-mono">₹${t.expressFee}</span>
            </div>
          ` : ''}
          <div class="flex justify-between">
            <span>Safety, tool sanitization & insurance fee</span>
            <span class="font-mono text-slate-800">₹${t.safetySanitization}</span>
          </div>
          ${t.discount > 0 ? `
            <div class="flex justify-between text-emerald-600 font-bold">
              <span>Promo discount</span>
              <span class="font-mono">-₹${t.discount}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-slate-500">
            <span>Bihar GST (18% — 9% CGST + 9% SGST)</span>
            <span class="font-mono">₹${t.gst}</span>
          </div>
          <div class="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
            <span>Total payable</span>
            <span class="text-amber-600 text-base font-mono">₹${t.finalPayable}</span>
          </div>
        </div>
      `;
    }

    const payButtonTotal = document.getElementById('pay-button-total-amount');
    if (payButtonTotal) payButtonTotal.innerText = `₹${t.finalPayable}`;
  },

  submitBooking() {
    if (!this.validateDetails()) return;
    if (!this.selectedSubservice) return;

    const custName = document.getElementById('book-customer-name').value.trim();
    const custPhone = document.getElementById('book-customer-phone').value.trim();
    const custArea = document.getElementById('book-area-select')?.value || 'Patna';
    const custAddress = document.getElementById('book-customer-address').value.trim();
    const custSlot = document.getElementById('book-slot-select')?.value || '';
    const paymentMethod = document.querySelector('input[name="book-payment"]:checked')?.value || 'Cash on Service';
    const t = this.computeTotals();

    const newBooking = {
      id: 'SEV-' + Date.now().toString().slice(-8),
      serviceName: this.selectedSubservice.name,
      category: this.selectedCategory.name,
      categoryId: this.selectedCategory.id,
      customerName: custName,
      phone: SevakApp.normalizePhone(custPhone),
      address: `${custAddress}, ${custArea}`,
      area: custArea,
      date: custSlot,
      status: 'Received',
      amount: t.finalPayable,
      paymentMethod,
      technician: {
        name: 'To be assigned',
        phone: SEVAK_DATA.brand.phone,
        rating: '—',
        badge: 'Confirmation pending'
      },
      uploadedMediaCount: this.uploadedFiles.length,
      isExpress: this.isExpress,
      createdAt: new Date().toISOString()
    };

    this.lastCreatedBooking = newBooking;
    SevakStore.addBooking(newBooking);

    this.goToStepVisible(4);
    for (let i = 1; i <= 3; i++) {
      const indicatorEl = document.getElementById(`step-indicator-${i}`);
      if (indicatorEl) {
        indicatorEl.classList.add('bg-amber-500', 'text-white');
      }
    }
    this.renderConfirmation(newBooking);
  },

  renderConfirmation(booking) {
    const confirmationEl = document.getElementById('booking-confirmation-content');
    if (!confirmationEl) return;

    const waText = `Hello SEVAK, I just booked ${booking.serviceName}. Booking ID: ${booking.id}. Name: ${booking.customerName}, Phone: ${booking.phone}, Address: ${booking.address}, Slot: ${booking.date}, Amount: ₹${booking.amount}, Pay: ${booking.paymentMethod}.`;

    confirmationEl.innerHTML = `
      <div class="text-center py-4">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <i data-lucide="check-circle" class="w-10 h-10"></i>
        </div>
        <h3 class="text-xl font-black text-slate-900">Request received</h3>
        <p class="text-xs text-slate-500 mt-1">Booking ID: <span class="font-mono font-bold text-amber-600">${booking.id}</span></p>
        <p class="text-xs text-slate-600 mt-2 max-w-sm mx-auto">Our Patna desk will confirm a technician on call or WhatsApp. No payment is captured on this website.</p>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4 text-left text-xs space-y-2">
          <div class="flex justify-between gap-2"><span class="text-slate-500">Service</span><span class="font-bold text-slate-800 text-right">${booking.serviceName}</span></div>
          <div class="flex justify-between gap-2"><span class="text-slate-500">When</span><span class="font-bold text-slate-800 text-right">${booking.date}</span></div>
          <div class="flex justify-between gap-2"><span class="text-slate-500">Amount</span><span class="font-bold text-slate-800">₹${booking.amount}</span></div>
          <div class="flex justify-between gap-2"><span class="text-slate-500">Payment</span><span class="font-bold text-slate-800 text-right">${booking.paymentMethod}</span></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <a href="${SevakStore.whatsappHref(waText)}" target="_blank" rel="noopener noreferrer"
            class="btn-primary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2">
            <i data-lucide="message-circle" class="w-4 h-4"></i> Send on WhatsApp
          </a>
          <a href="tel:${SEVAK_DATA.brand.callTo}" class="btn-navy py-3 px-4 text-xs font-bold flex items-center justify-center gap-2">
            <i data-lucide="phone-call" class="w-4 h-4"></i> Call helpline
          </a>
          <button type="button" onclick="SevakBooking.closeBooking(); SevakTracking.openTracking(SevakBooking.lastCreatedBooking);"
            class="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
            <i data-lucide="navigation" class="w-4 h-4"></i> View booking status
          </button>
          <button type="button" onclick="SevakInvoice.renderInvoice(SevakBooking.lastCreatedBooking);"
            class="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
            <i data-lucide="file-text" class="w-4 h-4"></i> View GST invoice
          </button>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }
};
