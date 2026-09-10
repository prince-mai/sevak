// SEVAK Platform - Live Technician Assignment & GPS Tracking Module
// Centers dynamically in Patna with animated route and ETA countdown

const SevakTracking = {
  mapInstance: null,
  technicianMarker: null,
  customerMarker: null,
  routePolyline: null,
  animationInterval: null,
  etaTimer: null,
  currentEtaMinutes: 18,
  currentEtaSeconds: 45,

  // Simulated route coordinates through Patna streets (Bailey Road to Boring Canal Road)
  routeCoordinates: [
    [25.6025, 85.1376], // Dak Bunglow Chowk
    [25.6050, 85.1320], // High Court / Bailey Road
    [25.6080, 85.1275], // Pantaloons Crossing
    [25.6110, 85.1250], // Boring Canal Road South
    [25.6135, 85.1235], // Boring Road Chauraha
    [25.6150, 85.1220]  // Customer Destination
  ],

  openTracking(booking = null) {
    const modal = document.getElementById('tracking-modal');
    if (!modal) return;

    modal.classList.remove('hidden');

    const defaultBooking = {
      id: 'SEV-8921',
      serviceName: 'AC Jet Service & Inverter Troubleshooting',
      customerName: 'Aman Verma',
      address: 'Flat 402, Shanti Vihar, Boring Road, Patna',
      otp: '4829',
      technician: SEVAK_DATA.technicianFleet[0]
    };

    const activeBooking = booking || defaultBooking;

    // Populate modal technician and OTP data
    const techNameEl = document.getElementById('track-tech-name');
    const techPhoneEl = document.getElementById('track-tech-phone');
    const techRatingEl = document.getElementById('track-tech-rating');
    const techExpEl = document.getElementById('track-tech-exp');
    const otpEl = document.getElementById('track-otp');
    const addressEl = document.getElementById('track-address');
    const serviceEl = document.getElementById('track-service-title');

    if (techNameEl) techNameEl.innerText = activeBooking.technician.name;
    if (techPhoneEl) {
      techPhoneEl.innerText = activeBooking.technician.phone;
      techPhoneEl.href = `tel:${activeBooking.technician.phone}`;
    }
    if (techRatingEl) techRatingEl.innerText = activeBooking.technician.rating + ' ★';
    if (techExpEl) techExpEl.innerText = activeBooking.technician.experience || '8+ yrs verified';
    if (otpEl) otpEl.innerText = activeBooking.otp || '4829';
    if (addressEl) addressEl.innerText = activeBooking.address;
    if (serviceEl) serviceEl.innerText = activeBooking.serviceName;

    // Reset ETA
    this.currentEtaMinutes = 18;
    this.currentEtaSeconds = 30;
    this.startEtaCountdown();

    // Initialize Leaflet Map after modal render
    setTimeout(() => {
      this.initMap();
    }, 150);

    if (window.lucide) lucide.createIcons();
  },

  closeTracking() {
    const modal = document.getElementById('tracking-modal');
    if (modal) modal.classList.add('hidden');

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    if (this.etaTimer) {
      clearInterval(this.etaTimer);
      this.etaTimer = null;
    }
  },

  initMap() {
    const mapContainer = document.getElementById('leaflet-map-container');
    if (!mapContainer) return;

    // If map already exists, invalidate size or recreate
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }

    const startPos = this.routeCoordinates[0];
    const destPos = this.routeCoordinates[this.routeCoordinates.length - 1];

    // Center map between Patna Dak Bunglow and Boring Road
    this.mapInstance = L.map('leaflet-map-container', {
      zoomControl: true,
      attributionControl: false
    }).setView([25.6090, 85.1290], 14);

    // OpenStreetMap tile layer (light and crisp)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.mapInstance);

    // Customer Marker (Destination)
    const customerIcon = L.divIcon({
      className: 'customer-home-pin',
      html: `
        <div class="w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
          🏠
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    this.customerMarker = L.marker(destPos, { icon: customerIcon })
      .addTo(this.mapInstance)
      .bindPopup("<b>Your Location:</b><br>Boring Road, Patna")
      .openPopup();

    // Technician Marker (Moving Radar Pin)
    const techIcon = L.divIcon({
      className: 'leaflet-technician-marker',
      html: `
        <div class="marker-pulse"></div>
        <div class="marker-pin">
          <span style="font-size: 18px;">⚡</span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    this.technicianMarker = L.marker(startPos, { icon: techIcon })
      .addTo(this.mapInstance)
      .bindPopup("<b>Rakesh Kumar</b><br>On the way on Bajaj Pulsar (BR-01-EQ-9102)");

    // Draw route polyline
    this.routePolyline = L.polyline(this.routeCoordinates, {
      color: '#d97706',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(this.mapInstance);

    this.mapInstance.fitBounds(this.routePolyline.getBounds(), { padding: [40, 40] });

    // Animate technician movement along Patna coordinates
    let step = 0;
    const totalSteps = this.routeCoordinates.length;

    if (this.animationInterval) clearInterval(this.animationInterval);
    this.animationInterval = setInterval(() => {
      step = (step + 1) % totalSteps;
      const nextPos = this.routeCoordinates[step];
      if (this.technicianMarker) {
        this.technicianMarker.setLatLng(nextPos);
      }

      // Update status banner
      const statusBanner = document.getElementById('tracking-live-status-text');
      if (statusBanner) {
        if (step === 0) statusBanner.innerText = 'Dispatched from Dak Bunglow Hub';
        else if (step === 2) statusBanner.innerText = 'Passing Pantaloons Crossing / Bailey Road';
        else if (step === 4) statusBanner.innerText = 'Approaching Boring Road Chauraha';
        else if (step === 5) statusBanner.innerText = 'Arrived at Shanti Vihar Gate';
      }
    }, 4000);
  },

  startEtaCountdown() {
    if (this.etaTimer) clearInterval(this.etaTimer);

    const etaDisplay = document.getElementById('track-eta-countdown');
    const updateEta = () => {
      if (this.currentEtaSeconds > 0) {
        this.currentEtaSeconds--;
      } else if (this.currentEtaMinutes > 0) {
        this.currentEtaMinutes--;
        this.currentEtaSeconds = 59;
      }

      if (etaDisplay) {
        etaDisplay.innerText = `${this.currentEtaMinutes}m ${this.currentEtaSeconds < 10 ? '0' : ''}${this.currentEtaSeconds}s`;
      }
    };

    updateEta();
    this.etaTimer = setInterval(updateEta, 1000);
  }
};
