// SEVAK Platform - AMC (Annual Maintenance Contracts) Module
// Interactive plans for Homes, Societies, Hospitals, and Builders

const SevakAMC = {
  renderPlans() {
    const container = document.getElementById('amc-plans-grid');
    if (!container) return;

    container.innerHTML = SEVAK_DATA.amcPlans.map(plan => `
      <div class="rounded-2xl border ${plan.color} p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div>
          <div class="flex justify-between items-start">
            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              ${plan.badge}
            </span>
          </div>

          <h3 class="text-xl font-bold text-slate-900 mt-3">${plan.title}</h3>
          <p class="text-xs text-slate-500 mt-0.5">${plan.subtitle}</p>

          <div class="mt-4 pb-4 border-b border-slate-200">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-slate-900 font-mono">₹${plan.price.toLocaleString('en-IN')}</span>
              <span class="text-xs font-semibold text-slate-500">${plan.billing}</span>
            </div>
            <p class="text-[11px] text-emerald-600 font-medium mt-1">Includes 18% GST Input Credit Invoice</p>
          </div>

          <ul class="mt-5 space-y-2.5 text-xs text-slate-700">
            ${plan.features.map(f => `
              <li class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="mt-8 pt-4">
          <button onclick="SevakAMC.selectPlan('${plan.id}')"
            class="w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              plan.id === 'society-master'
                ? 'btn-primary'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }">
            <span>Subscribe & Schedule Audit</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  selectPlan(planId) {
    const plan = SEVAK_DATA.amcPlans.find(p => p.id === planId) || SEVAK_DATA.amcPlans[0];
    SevakBooking.openBooking('amc');
    // Set custom note
    setTimeout(() => {
      const notesEl = document.getElementById('book-customer-address');
      if (notesEl && notesEl.value.indexOf('AMC Plan:') === -1) {
        notesEl.value = `[Selected AMC Plan: ${plan.title} - ₹${plan.price}/yr] ` + notesEl.value;
      }
    }, 200);
  },

  calculateCustomSocietyAMC() {
    const flatsCount = parseInt(document.getElementById('amc-flats-slider')?.value || '30', 10);
    const tanksPerYear = parseInt(document.getElementById('amc-tanks-select')?.value || '4', 10);

    const flatsDisplay = document.getElementById('amc-flats-count-display');
    if (flatsDisplay) flatsDisplay.innerText = `${flatsCount} Flats / Units`;

    // Base cost per flat per year is approx ₹550 + tank clean ₹600/tank
    const basePerFlat = 550;
    const tankCost = tanksPerYear * 600;
    const annualTotal = Math.round((flatsCount * basePerFlat) + tankCost);
    const perFlatMonthly = Math.round(annualTotal / (flatsCount * 12));

    const costDisplay = document.getElementById('amc-custom-calculated-cost');
    if (costDisplay) {
      costDisplay.innerHTML = `
        <div class="text-2xl font-black text-slate-900 font-mono">₹${annualTotal.toLocaleString('en-IN')} <span class="text-xs font-semibold text-slate-500">/ year</span></div>
        <p class="text-xs text-amber-600 font-semibold mt-0.5">Only ~₹${perFlatMonthly}/month per flat</p>
      `;
    }
  }
};
