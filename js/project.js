// SEVAK Platform - Turnkey B2B Project Management & Milestone Tracker
// Tailored for Commercial Complexes, Clinics, Schools, Societies & Builders

const SevakProject = {
  renderProjectDashboard() {
    const container = document.getElementById('b2b-project-tracker-container');
    if (!container) return;

    const proj = SEVAK_DATA.b2bProjectDemo;

    container.innerHTML = `
      <div class="glass-card rounded-2xl p-6 border border-slate-200">
        <!-- Project Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Sample project (illustrative)
              </span>
              <span class="text-xs text-slate-400 font-mono font-semibold">${proj.projectId}</span>
            </div>
            <h3 class="text-lg md:text-xl font-black text-slate-900 mt-1">${proj.title}</h3>
            <p class="text-xs text-slate-500 mt-0.5">Client: <span class="font-semibold text-slate-700">${proj.client}</span> • Target Handover: <span class="font-semibold text-slate-700">${proj.completionTarget}</span></p>
          </div>

          <div class="flex items-center gap-4 text-right">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400">Total Project Value</span>
              <p class="text-xl font-black text-slate-900 font-mono">${proj.totalBudget}</p>
            </div>
            <button onclick="SevakProject.openBlueprintModal()"
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition">
              <i data-lucide="folder-down" class="w-4 h-4"></i>
              <span>View Blueprints</span>
            </button>
          </div>
        </div>

        <!-- Overall Progress Bar -->
        <div class="py-5">
          <div class="flex justify-between items-center text-xs font-bold mb-2">
            <span class="text-slate-700">Turnkey Execution Completion</span>
            <span class="text-amber-600 font-mono">${proj.progress}% Completed</span>
          </div>
          <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-1000" style="width: ${proj.progress}%;"></div>
          </div>
        </div>

        <!-- Milestones Timeline -->
        <div class="mt-4 space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Phase Milestones & QA Approvals</h4>
          <div class="space-y-3">
            ${proj.milestones.map((m, idx) => `
              <div class="p-3.5 rounded-xl border ${
                m.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : m.status === 'in-progress'
                  ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-300'
                  : 'border-slate-200 bg-slate-50/50 opacity-70'
              } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    m.status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : m.status === 'in-progress'
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-300 text-slate-600'
                  }">
                    ${m.status === 'completed' ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h5 class="font-bold text-slate-900 text-xs sm:text-sm">${m.title}</h5>
                    <p class="text-[11px] text-slate-500">${m.notes}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 sm:text-right shrink-0">
                  <span class="text-[11px] font-mono text-slate-500">${m.date}</span>
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    m.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : m.status === 'in-progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-600'
                  }">
                    ${m.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  openBlueprintModal() {
    const modal = document.getElementById('blueprint-preview-modal');
    if (modal) {
      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
  },

  closeBlueprintModal() {
    const modal = document.getElementById('blueprint-preview-modal');
    if (modal) modal.classList.add('hidden');
  }
};
