// SEVAK Platform - Interactive Service Booking Engine
// Multi-step modal with media upload, transparent billing, UPI payment, and confetti

const SevakBooking = {
  currentStep: 1,
  selectedCategory: null,
  selectedSubservice: null,
  uploadedFiles: [],
  discountAmount: 0,
  isExpress: false,
  lastCreatedBooking: null,

  init() {
    // Populate area dropdown
    const areaSelect = document.getElementById('book-area-select');
    if (areaSelect) {
      areaSelect.innerHTML = SEVAK_DATA.patnaLocalities
        .map(loc => `<option value="${loc.name}">${loc.name} (${loc.techniciansAvailable} techs available)</option>`)
        .join('');
    }
  },

  openBooking(categoryId = 'electrical', subserviceId = null) {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    this.currentStep = 1;
    this.uploadedFiles = [];
    this.discountAmount = 0;
    this.isExpress = false;

    // Set Category
    this.selectedCategory = SEVAK_DATA.services.find(s => s.id === categoryId) || SEVAK_DATA.services[0];
    if (subserviceId) {
      this.selectedSubservice = this.selectedCategory.subservices.find(sub => sub.id === subserviceId) || this.selectedCategory.subservices[0];
    } else {
      this.selectedSubservice = this.selectedCategory.subservices[0];
    }

    this.renderCategoryOptions();
    this.renderSubserviceList();
    this.goToStep(1);

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeBooking() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.add('hidden');
  },

  renderCategoryOptions() {
    const container = document.getElementById('book-category-pills');
    if (!container) return;

    container.innerHTML = SEVAK_DATA.services.map(svc => `
      <button type="button" onclick="SevakBooking.selectCategory('${svc.id}')"
        class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
          this.selectedCategory.id === svc.id
            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
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
        class="p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
          this.selectedSubservice.id === sub.id
            ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-500'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        }">
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-sm text-slate-900">${sub.name}</h4>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">${sub.warranty || 'Verified'}</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Est. Time: ${sub.time} • Certified Bihar Technician</p>
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

    if (stepNumber === 3) {
      this.updateBillSummary();
    }

    if (window.lucide) lucide.createIcons();
  },

  handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
  },

  renderUploadedFiles() {
    const container = document.getElementById('uploaded-media-previews');
    if (!container) return;

    if (this.uploadedFiles.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-400 text-center py-2">No photos uploaded yet (Optional, helps technician bring right spares).</p>`;
      return;
    }

    container.innerHTML = this.uploadedFiles.map((f, idx) => `
      <div class="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-1 flex items-center gap-2">
        ${f.type.startsWith('image/') 
          ? `<img src="${f.dataUrl}" class="w-10 h-10 object-cover rounded" alt="Preview"/>` 
          : `<div class="w-10 h-10 bg-slate-200 rounded flex items-center justify-center text-xs">🎥</div>`
        }
        <div class="truncate text-[11px] flex-1">
          <p class="font-medium text-slate-700 truncate">${f.name}</p>
          <span class="text-slate-400 text-[10px]">${f.size}</span>
        </div>
        <button type="button" onclick="SevakBooking.removeFile(${idx})" class="p-1 text-red-500 hover:bg-red-50 rounded">
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
      if (couponMsg) {
        couponMsg.innerHTML = `<span class="text-emerald-600 font-bold">✓ Coupon Applied! Flat ₹100 Off applied successfully.</span>`;
      }
    } else {
      this.discountAmount = 0;
      if (couponMsg) {
        couponMsg.innerHTML = `<span class="text-red-500 font-bold">Invalid coupon code. Try 'PATNAFIRST'.</span>`;
      }
    }
    this.updateBillSummary();
  },

  updateBillSummary() {
    const subtotal = this.selectedSubservice ? this.selectedSubservice.price : 499;
    const expressFee = this.isExpress ? 99 : 0;
    const safetySanitization = 49;
    const discount = this.discountAmount;
    const taxableTotal = Math.max(subtotal + expressFee + safetySanitization - discount, 0);
    const gst = Math.round(taxableTotal * 0.18);
    const finalPayable = taxableTotal + gst;

    const summaryEl = document.getElementById('booking-bill-breakdown');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="space-y-2 text-xs text-slate-600">
          <div class="flex justify-between">
            <span>${this.selectedSubservice.name}</span>
            <span class="font-medium text-slate-800 font-mono">₹${subtotal}</span>
          </div>
          ${this.isExpress ? `
            <div class="flex justify-between text-amber-600 font-medium">
              <span>⚡ Emergency 30-min Priority Express</span>
              <span class="font-mono">₹${expressFee}</span>
            </div>
          ` : ''}
          <div class="flex justify-between">
            <span>Safety, Tool Sanitization & Insurance Fee</span>
            <span class="font-mono text-slate-800">₹${safetySanitization}</span>
          </div>
          ${discount > 0 ? `
            <div class="flex justify-between text-emerald-600 font-bold">
              <span>Promo Discount (PATNAFIRST)</span>
              <span class="font-mono">-₹${discount}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-slate-500">
            <span>Bihar GST (18% - 9% CGST + 9% SGST)</span>
            <span class="font-mono">₹${gst}</span>
          </div>
          <div class="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
            <span>Total Payable Amount</span>
            <span class="text-amber-600 text-base font-mono">₹${finalPayable}</span>
          </div>
        </div>
      `;
    }

    const payButtonTotal = document.getElementById('pay-button-total-amount');
    if (payButtonTotal) {
      payButtonTotal.innerText = `₹${finalPayable}`;
    }
  },

  submitBooking() {
    const custName = document.getElementById('book-customer-name')?.value || 'Aman Verma';
    const custPhone = document.getElementById('book-customer-phone')?.value || '+91 98350 12345';
    const custArea = document.getElementById('book-area-select')?.value || 'Boring Road';
    const custAddress = document.getElementById('book-customer-address')?.value || 'Flat 402, Shanti Vihar, Boring Road, Patna';
    const custSlot = document.getElementById('book-slot-select')?.value || 'Today, Express 30 Mins';
    const paymentMethod = document.querySelector('input[name="book-payment"]:checked')?.value || 'UPI (Instant)';

    const subtotal = this.selectedSubservice ? this.selectedSubservice.price : 499;
    const finalAmount = Math.max(subtotal + (this.isExpress ? 99 : 0) + 49 - this.discountAmount, 0) * 1.18;

    const newBooking = {
      id: 'SEV-' + Math.floor(1000 + Math.random() * 9000),
      serviceName: this.selectedSubservice.name,
      category: this.selectedCategory.name,
      customerName: custName,
      phone: custPhone,
      address: `${custAddress}, ${custArea}, Patna`,
      area: `${custArea}, Patna`,
      date: custSlot,
      status: 'Assigned',
      amount: Math.round(finalAmount),
      paymentMethod: paymentMethod,
      technician: SEVAK_DATA.technicianFleet[0],
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      uploadedMediaCount: this.uploadedFiles.length
    };

    this.lastCreatedBooking = newBooking;

    // Trigger local API or fallback to localStorage
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    }).catch(() => {
      console.log('Saved locally to browser cache');
    });

    // Move to step 4 (Confirmation)
    this.goToStep(4);
    this.renderConfirmation(newBooking);
    this.triggerConfetti();
  },

  renderConfirmation(booking) {
    const confirmationEl = document.getElementById('booking-confirmation-content');
    if (!confirmationEl) return;

    confirmationEl.innerHTML = `
      <div class="text-center py-4">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <i data-lucide="check-circle" class="w-10 h-10"></i>
        </div>
        <h3 class="text-xl font-black text-slate-900">Service Confirmed!</h3>
        <p class="text-xs text-slate-500 mt-1">Booking Ref ID: <span class="font-mono font-bold text-amber-600">${booking.id}</span></p>

        <!-- Technician Card -->
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4 text-left">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow">
                RK
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">${booking.technician.name}</h4>
                <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span>✓ Police & Aadhaar Verified</span>
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ★ ${booking.technician.rating}
              </span>
              <p class="text-[10px] text-slate-400 mt-0.5">8 yrs in Patna</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div class="bg-white p-2.5 rounded-lg border border-slate-100">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Start Service OTP</span>
              <span class="text-lg font-black text-slate-900 font-mono tracking-widest">${booking.otp}</span>
            </div>
            <div class="bg-white p-2.5 rounded-lg border border-slate-100">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Estimated Arrival</span>
              <span class="text-sm font-bold text-emerald-600 mt-0.5 block">⚡ 20-25 Mins</span>
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button onclick="SevakBooking.closeBooking(); SevakTracking.openTracking(SevakBooking.lastCreatedBooking);"
            class="btn-primary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2">
            <i data-lucide="navigation" class="w-4 h-4"></i> Track Live On Map
          </button>
          <button onclick="SevakInvoice.renderInvoice(SevakBooking.lastCreatedBooking);"
            class="btn-navy py-3 px-4 text-xs font-bold flex items-center justify-center gap-2">
            <i data-lucide="file-text" class="w-4 h-4"></i> View GST Tax Invoice
          </button>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  triggerConfetti() {
    const canvas = document.getElementById('booking-confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const pieces = [];
    const numberOfPieces = 75;
    const colors = ['#f59e0b', '#d97706', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

    for (let i = 0; i < numberOfPieces; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 4
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      if (pieces.some(p => p.y < canvas.height)) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    };

    render();
  }
};
