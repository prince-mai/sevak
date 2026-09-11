// SEVAK — local persistence with optional API sync (works on GitHub Pages and Node)

const SevakStore = {
  keys: {
    bookings: 'sevak_bookings_v1',
    quotes: 'sevak_quotes_v1'
  },

  read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('SEVAK storage write failed', e);
    }
  },

  getBookings() {
    return this.read(this.keys.bookings);
  },

  getQuotes() {
    return this.read(this.keys.quotes);
  },

  lastBooking() {
    return this.getBookings()[0] || null;
  },

  addBooking(booking) {
    const list = this.getBookings();
    list.unshift(booking);
    this.write(this.keys.bookings, list.slice(0, 80));
    this.postJson('/api/bookings', booking);
  },

  addQuote(quote) {
    const list = this.getQuotes();
    list.unshift(quote);
    this.write(this.keys.quotes, list.slice(0, 80));
    this.postJson('/api/quotes', quote);
  },

  updateBooking(id, patch) {
    const list = this.getBookings().map(b => (b.id === id ? { ...b, ...patch } : b));
    this.write(this.keys.bookings, list);
  },

  postJson(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => null);
  },

  fetchJson(url) {
    return fetch(url, { headers: { Accept: 'application/json' } })
      .then(res => (res.ok ? res.json() : null))
      .catch(() => null);
  },

  whatsappHref(text) {
    const phone = (SEVAK_DATA.brand.callTo || '919661168109').replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
};
