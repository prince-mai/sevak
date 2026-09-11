// SEVAK Platform - GST Invoice Generator Module
// Bihar State Code 10 — provisional tax invoice from a confirmed booking

const SevakInvoice = {
  normalizeTechnician(booking) {
    const tech = booking && booking.technician;
    if (tech && typeof tech === 'object') {
      return {
        name: tech.name || 'To be assigned',
        badge: tech.badge || 'SEVAK Partner',
        phone: tech.phone || SEVAK_DATA.brand.phone
      };
    }
    if (typeof tech === 'string' && tech.trim()) {
      return { name: tech, badge: 'SEVAK Partner', phone: SEVAK_DATA.brand.phone };
    }
    return { name: 'To be assigned', badge: 'SEVAK Partner', phone: SEVAK_DATA.brand.phone };
  },

  renderInvoice(booking) {
    const invoiceModal = document.getElementById('gst-invoice-modal');
    if (!invoiceModal || !booking) return;

    const baseAmount = Number(booking.amount) || 0;
    const taxableAmount = Math.round((baseAmount / 1.18) * 100) / 100;
    const cgst = Math.round(taxableAmount * 0.09 * 100) / 100;
    const sgst = Math.round(taxableAmount * 0.09 * 100) / 100;
    const invoiceNumber = 'INV/BR/' + String(booking.id || 'DRAFT').replace('SEV-', '') + '/26';
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const tech = this.normalizeTechnician(booking);
    const isCod = /cash|cod|after/i.test(booking.paymentMethod || '');
    const payLabel = isCod
      ? 'PAYABLE ON COMPLETION'
      : `RECORDED: ${booking.paymentMethod || 'To be confirmed'}`;

    const invoiceHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="invoice-title">
        <div class="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full p-5 sm:p-8 relative my-0 sm:my-8 border border-slate-200 modal-sheet-container">
          <div class="modal-drag-handle"></div>
          <div class="flex justify-between items-center pb-4 border-b border-slate-100 no-print">
            <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Provisional tax invoice
            </div>
            <div class="flex items-center gap-3">
              <button type="button" onclick="window.print()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print / Save PDF
              </button>
              <button type="button" onclick="SevakInvoice.closeInvoice()" class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition" aria-label="Close invoice">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
          </div>

          <div class="mt-4 text-slate-800" id="printable-tax-invoice">
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-black tracking-tight text-slate-900">SEVAK</span>
                  <span class="text-xs bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">BIHAR</span>
                </div>
                <p class="text-xs text-slate-500 mt-1 font-medium">One Platform, Every Service</p>
                <p class="text-[11px] text-slate-500 leading-tight mt-1 max-w-xs">${SEVAK_DATA.brand.address}</p>
                <p class="text-[11px] text-slate-600 mt-1 font-semibold">
                  GSTIN: <span class="font-mono text-slate-900">${SEVAK_DATA.brand.gstin}</span>
                </p>
                <p class="text-[11px] text-slate-600 font-semibold">
                  State Code: <span class="text-slate-900">${SEVAK_DATA.brand.stateCode}</span>
                </p>
              </div>

              <div class="text-left sm:text-right">
                <h3 id="invoice-title" class="text-xl font-bold uppercase tracking-wide text-slate-900">TAX INVOICE</h3>
                <p class="text-xs font-semibold font-mono text-amber-600 mt-1">${invoiceNumber}</p>
                <p class="text-xs text-slate-500 mt-0.5">Date: ${invoiceDate}</p>
                <p class="text-xs text-slate-500 mt-0.5">Booking Ref: <span class="font-mono font-medium">${booking.id || '—'}</span></p>
                <div class="mt-2 inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded">
                  ${payLabel}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
              <div>
                <p class="text-[10px] font-bold uppercase text-slate-400">Billed To (Customer):</p>
                <p class="font-bold text-slate-900 text-sm mt-1">${booking.customerName || '—'}</p>
                <p class="text-slate-600">${booking.phone || '—'}</p>
                <p class="text-slate-600 mt-0.5">${booking.address || '—'}</p>
                <p class="text-slate-600">Bihar — State Code: 10</p>
              </div>
              <div class="sm:text-right">
                <p class="text-[10px] font-bold uppercase text-slate-400">Service partner:</p>
                <p class="font-bold text-slate-900 text-sm mt-1">${tech.name}</p>
                <p class="text-slate-600">${tech.badge}</p>
                <p class="text-slate-500 mt-0.5">Contact: ${tech.phone}</p>
              </div>
            </div>

            <div class="py-4 overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="bg-slate-50 text-slate-500 font-bold border-y border-slate-200 uppercase text-[10px]">
                    <th scope="col" class="py-2.5 px-3">Description of Service</th>
                    <th scope="col" class="py-2.5 px-2 text-center">SAC Code</th>
                    <th scope="col" class="py-2.5 px-2 text-center">Qty</th>
                    <th scope="col" class="py-2.5 px-3 text-right">Taxable Value</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td class="py-3 px-3">
                      <p class="font-bold text-slate-800">${booking.serviceName || 'Professional on-site service'}</p>
                      <p class="text-[11px] text-slate-500">Labor, diagnostics and workmanship as booked. Final extra parts billed on site if approved.</p>
                    </td>
                    <td class="py-3 px-2 text-center font-mono text-slate-600">998719</td>
                    <td class="py-3 px-2 text-center text-slate-600">1</td>
                    <td class="py-3 px-3 text-right font-mono text-slate-800">₹ ${taxableAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
              <div class="flex justify-between py-1 text-slate-600">
                <span>Subtotal (Taxable Value)</span>
                <span class="font-mono font-medium">₹ ${taxableAmount.toFixed(2)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-600">
                <span>CGST (Central Tax @ 9%)</span>
                <span class="font-mono">₹ ${cgst.toFixed(2)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-600">
                <span>SGST (Bihar State Tax @ 9%)</span>
                <span class="font-mono">₹ ${sgst.toFixed(2)}</span>
              </div>
              <div class="border-t border-slate-300 mt-2 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total (Incl. Taxes)</span>
                <span class="font-mono text-amber-600">₹ ${baseAmount.toFixed(2)}</span>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
              <p>Computer-generated provisional invoice. Confirm GST credit with accounts if you need an e-invoice / IRN.</p>
              <p class="font-semibold text-slate-600">SEVAK Technologies Bihar Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    invoiceModal.innerHTML = invoiceHTML;
    invoiceModal.classList.remove('hidden');
    invoiceModal.setAttribute('aria-hidden', 'false');
    if (window.lucide) lucide.createIcons();
  },

  closeInvoice() {
    const invoiceModal = document.getElementById('gst-invoice-modal');
    if (invoiceModal) {
      invoiceModal.classList.add('hidden');
      invoiceModal.setAttribute('aria-hidden', 'true');
      invoiceModal.innerHTML = '';
    }
  }
};
