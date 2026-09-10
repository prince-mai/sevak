// SEVAK Platform - GST Invoice Generator Module
// Generates official Bihar State Tax Invoices (State Code: 10)

const SevakInvoice = {
  renderInvoice(booking) {
    const invoiceModal = document.getElementById('gst-invoice-modal');
    if (!invoiceModal) return;

    const baseAmount = booking.amount || 699;
    // 18% GST (9% CGST + 9% SGST)
    const taxableAmount = Math.round((baseAmount / 1.18) * 100) / 100;
    const cgst = Math.round(((taxableAmount * 0.09) * 100)) / 100;
    const sgst = Math.round(((taxableAmount * 0.09) * 100)) / 100;
    const invoiceNumber = 'INV/BR/' + (booking.id ? booking.id.replace('SEV-', '') : '8921') + '/26';
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const invoiceHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8 border border-slate-200">
          <!-- Close & Print Bar -->
          <div class="flex justify-between items-center pb-4 border-b border-slate-100 no-print">
            <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Tax Invoice Paid
            </div>
            <div class="flex items-center gap-3">
              <button onclick="window.print()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print / Save PDF
              </button>
              <button onclick="SevakInvoice.closeInvoice()" class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
          </div>

          <!-- Printable Area -->
          <div class="mt-4 text-slate-800" id="printable-tax-invoice">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-black tracking-tight text-slate-900">SEVAK</span>
                  <span class="text-xs bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">BIHAR</span>
                </div>
                <p class="text-xs text-slate-500 mt-1 font-medium">One Platform, Every Service</p>
                <p class="text-[11px] text-slate-500 leading-tight mt-1 max-w-xs">
                  ${SEVAK_DATA.brand.address}
                </p>
                <p class="text-[11px] text-slate-600 mt-1 font-semibold">
                  GSTIN: <span class="font-mono text-slate-900">${SEVAK_DATA.brand.gstin}</span>
                </p>
                <p class="text-[11px] text-slate-600 font-semibold">
                  State Code: <span class="text-slate-900">${SEVAK_DATA.brand.stateCode}</span>
                </p>
              </div>

              <div class="text-left sm:text-right">
                <h3 class="text-xl font-bold uppercase tracking-wide text-slate-900">TAX INVOICE</h3>
                <p class="text-xs font-semibold font-mono text-amber-600 mt-1">${invoiceNumber}</p>
                <p class="text-xs text-slate-500 mt-0.5">Date: ${invoiceDate}</p>
                <p class="text-xs text-slate-500 mt-0.5">Booking Ref: <span class="font-mono font-medium">${booking.id || 'SEV-8921'}</span></p>
                <div class="mt-2 inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded">
                  PAID VIA ${booking.paymentMethod || 'UPI (Instant)'}
                </div>
              </div>
            </div>

            <!-- Billed To & Service Details -->
            <div class="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
              <div>
                <p class="text-[10px] font-bold uppercase text-slate-400">Billed To (Customer):</p>
                <p class="font-bold text-slate-900 text-sm mt-1">${booking.customerName || 'Aman Verma'}</p>
                <p class="text-slate-600">${booking.phone || '+91 98350 12345'}</p>
                <p class="text-slate-600 mt-0.5">${booking.address || 'Flat 402, Shanti Vihar, Boring Road, Patna'}</p>
                <p class="text-slate-600">Patna, Bihar - State Code: 10</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold uppercase text-slate-400">Fulfillment Partner:</p>
                <p class="font-bold text-slate-900 text-sm mt-1">${booking.technician ? booking.technician.name : 'Rakesh Kumar'}</p>
                <p class="text-slate-600">${booking.technician ? booking.technician.badge : 'Verified Master Technician'}</p>
                <p class="text-slate-500 mt-0.5">Contact: ${booking.technician ? booking.technician.phone : '+91 94310 88761'}</p>
                <p class="text-emerald-600 font-semibold mt-0.5">Police & Aadhaar Verified</p>
              </div>
            </div>

            <!-- Invoice Item Table -->
            <div class="py-4">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="bg-slate-50 text-slate-500 font-bold border-y border-slate-200 uppercase text-[10px]">
                    <th class="py-2.5 px-3">Description of Service</th>
                    <th class="py-2.5 px-2 text-center">SAC Code</th>
                    <th class="py-2.5 px-2 text-center">Qty</th>
                    <th class="py-2.5 px-3 text-right">Taxable Value</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td class="py-3 px-3">
                      <p class="font-bold text-slate-800">${booking.serviceName || 'Professional On-Site Service'}</p>
                      <p class="text-[11px] text-slate-500">Including diagnostics, professional labor, safety sanitized gear & 30-day warranty.</p>
                    </td>
                    <td class="py-3 px-2 text-center font-mono text-slate-600">998719</td>
                    <td class="py-3 px-2 text-center text-slate-600">1</td>
                    <td class="py-3 px-3 text-right font-mono text-slate-800">₹ ${taxableAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tax Summary Breakdown -->
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

            <!-- Footer Compliance -->
            <div class="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
              <p>This is a computer-generated tax invoice under the Bihar Goods and Services Tax Act.</p>
              <p class="font-semibold text-slate-600">SEVAK Technologies Bihar Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    invoiceModal.innerHTML = invoiceHTML;
    invoiceModal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeInvoice() {
    const invoiceModal = document.getElementById('gst-invoice-modal');
    if (invoiceModal) invoiceModal.classList.add('hidden');
  }
};
