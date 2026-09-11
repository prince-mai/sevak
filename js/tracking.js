// SEVAK Platform - Booking status (no simulated GPS)

const SevakTracking = {
  openTracking(booking = null) {
    const modal = document.getElementById('tracking-modal');
    if (!modal) return;

    const activeBooking = booking || SevakBooking.lastCreatedBooking || SevakStore.lastBooking();
    const empty = document.getElementById('tracking-empty-state');
    const details = document.getElementById('tracking-booking-details');

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    if (!activeBooking) {
      if (empty) empty.classList.remove('hidden');
      if (details) details.classList.add('hidden');
      if (window.lucide) lucide.createIcons();
      return;
    }

    if (empty) empty.classList.add('hidden');
    if (details) details.classList.remove('hidden');

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.innerText = value;
    };

    setText('track-service-title', activeBooking.serviceName || 'Service booking');
    setText('tracking-live-status-text', activeBooking.status || 'Received');
    setText('track-booking-id', activeBooking.id);
    setText('track-address', activeBooking.address || '—');
    setText('track-slot', activeBooking.date || '—');
    setText('track-amount', activeBooking.amount != null ? `₹${activeBooking.amount}` : '—');
    setText('track-payment', activeBooking.paymentMethod || '—');
    setText('track-tech-name', (activeBooking.technician && activeBooking.technician.name) || 'To be assigned');

    const phone = (activeBooking.technician && activeBooking.technician.phone) || SEVAK_DATA.brand.phone;
    const phoneLink = document.getElementById('track-tech-phone');
    if (phoneLink) {
      phoneLink.href = `tel:${phone.replace(/\s/g, '')}`;
    }

    const wa = document.getElementById('track-whatsapp');
    if (wa) {
      wa.href = SevakStore.whatsappHref(
        `Hello SEVAK, following up on booking ${activeBooking.id} (${activeBooking.serviceName}).`
      );
    }

    if (window.lucide) lucide.createIcons();
  },

  closeTracking() {
    const modal = document.getElementById('tracking-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
};
