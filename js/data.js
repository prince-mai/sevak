// SEVAK Platform - Central Data Model & Catalog
// Tailored for Patna & Bihar Services

const SEVAK_DATA = {
  brand: {
    name: "SEVAK",
    nameHindi: "सेवक",
    tagline: "One Platform, Every Service",
    taglineHindi: "हर काम, अब आसान — पूरे पटना और बिहार में",
    phone: "+91 96611 68109",
    tollFree: "+91 96611 68109",
    callTo: "+919661168109",
    email: "support@sevakbihar.com",
    address: "SEVAK Tower, 3rd Floor, Opp. Maurya Lok Complex, Dak Bunglow Road, Patna, Bihar 800001",
    gstin: "10AABCS8891P1ZK",
    stateCode: "10 (Bihar)"
  },

  patnaLocalities: [
    { name: "Boring Road", techniciansAvailable: 18, avgEtaMinutes: 20 },
    { name: "Kankarbagh", techniciansAvailable: 24, avgEtaMinutes: 18 },
    { name: "Bailey Road (Raja Bazar)", techniciansAvailable: 15, avgEtaMinutes: 22 },
    { name: "Danapur & Saguna More", techniciansAvailable: 19, avgEtaMinutes: 25 },
    { name: "Patliputra Colony", techniciansAvailable: 12, avgEtaMinutes: 19 },
    { name: "Rajendra Nagar", techniciansAvailable: 14, avgEtaMinutes: 21 },
    { name: "Ashiana Nagar / Jagdeo Path", techniciansAvailable: 16, avgEtaMinutes: 24 },
    { name: "Anisabad & Bypass", techniciansAvailable: 11, avgEtaMinutes: 28 },
    { name: "Patna City (Gulzarbagh/Chowk)", techniciansAvailable: 13, avgEtaMinutes: 30 },
    { name: "Exhibition Road & Gandhi Maidan", techniciansAvailable: 10, avgEtaMinutes: 15 },
    { name: "Phulwari Sharif & AIIMS Area", techniciansAvailable: 14, avgEtaMinutes: 27 },
    { name: "Digha & Kurji", techniciansAvailable: 9, avgEtaMinutes: 25 }
  ],

  biharDistricts: [
    { name: "Patna (Capital Hub)", status: "Active - 24/7 Super-Fast Dispatch" },
    { name: "Muzaffarpur", status: "Active - Full Services" },
    { name: "Gaya", status: "Active - Full Services" },
    { name: "Bhagalpur", status: "Active - Full Services" },
    { name: "Darbhanga", status: "Active - Full Services" },
    { name: "Begusarai", status: "Active - B2B & Turnkey Hub" },
    { name: "Purnea", status: "Active - Full Services" },
    { name: "Ara (Bhojpur)", status: "Active - Home & AMC" },
    { name: "Bihar Sharif (Nalanda)", status: "Active - Full Services" }
  ],

  // 14 Core Verticals
  services: [
    {
      id: "electrical",
      name: "Electrical & Power",
      nameHindi: "बिजली और वायरिंग सेवा",
      icon: "zap",
      badge: "High Demand",
      color: "from-amber-400 via-orange-500 to-amber-600",
      description: "Fast MCB fixes, inverter/UPS wiring, AC maintenance, heavy load panels & rewiring.",
      subservices: [
        { id: "e1", name: "Switch & Socket Repair / Replacement", price: 149, time: "30 mins", warranty: "30 Days Warranty" },
        { id: "e2", name: "Inverter / UPS Installation & Battery Wiring", price: 449, time: "60 mins", warranty: "45 Days Warranty" },
        { id: "e3", name: "AC Foam Jet Service & Gas Leak Check", price: 599, time: "45 mins", warranty: "60 Days Cooling Guarantee" },
        { id: "e4", name: "MCB Tripping / Short Circuit Troubleshooting", price: 349, time: "40 mins", warranty: "30 Days Warranty" },
        { id: "e5", name: "Ceiling Fan Installation / Rewinding Fix", price: 199, time: "30 mins", warranty: "30 Days Warranty" },
        { id: "e6", name: "Complete Room / Flat Rewiring Audit", price: 999, time: "2-3 hours", warranty: "1 Year Certificate" }
      ]
    },
    {
      id: "plumbing",
      name: "Plumbing & Sanitation",
      nameHindi: "प्लंबिंग और जल सेवा",
      icon: "droplet",
      badge: "Emergency 30m",
      color: "from-cyan-400 via-blue-600 to-indigo-600",
      description: "Leakage repair, sanitary fixtures, water tank descaling, submersible motor repairs.",
      subservices: [
        { id: "p1", name: "Tap & Mixer Leakage Repair / Installation", price: 179, time: "30 mins", warranty: "30 Days Leak-Proof Guarantee" },
        { id: "p2", name: "Overhead Water Tank Scientific High-Pressure Cleaning (1000L)", price: 799, time: "90 mins", warranty: "Anti-Bacterial UV Treated" },
        { id: "p3", name: "Submersible Pump & Motor Inspection / Starter Fix", price: 499, time: "60 mins", warranty: "45 Days Warranty" },
        { id: "p4", name: "Bathroom Drain Blockage Cleaning (Machine Unclog)", price: 399, time: "45 mins", warranty: "Instant Free Flow" },
        { id: "p5", name: "Western Toilet / Commode Installation & Jet Spray", price: 649, time: "60 mins", warranty: "30 Days Warranty" },
        { id: "p6", name: "RO Water Purifier Filter Change & Service", price: 399, time: "45 mins", warranty: "TDS Check Guaranteed" }
      ]
    },
    {
      id: "pest-control",
      name: "Pest Control & Termite",
      nameHindi: "दीमक और कीट नियंत्रण",
      icon: "shield-alert",
      badge: "Govt Certified",
      color: "from-emerald-400 via-teal-500 to-green-600",
      description: "Eco-safe herbal pest control, 2-year termite drill warranty, mosquito fogging & bedbug relief.",
      subservices: [
        { id: "pc1", name: "Complete Home Herbal Cockroach & Ant Gel Treatment", price: 899, time: "60 mins", warranty: "90 Days Warranty" },
        { id: "pc2", name: "Anti-Termite Drilling Warranty Treatment (1 BHK / 2 BHK / 3 BHK)", price: 2199, time: "3-4 hours", warranty: "2 Years Govt-Approved Warranty" },
        { id: "pc3", name: "Bed Bug Eradication (2-Visit Intensive Heat/Chemical)", price: 1499, time: "2 hours", warranty: "100% Elimination Guarantee" },
        { id: "pc4", name: "Mosquito & Dengue Prevention Thermal Fogging", price: 999, time: "45 mins", warranty: "Herbal & Odorless" },
        { id: "pc5", name: "Rodent & Rat Baiting / Trap Matrix (Offices/Homes)", price: 699, time: "40 mins", warranty: "Tamper-proof Boxes" }
      ]
    },
    {
      id: "cleaning",
      name: "Deep Cleaning & Hygiene",
      nameHindi: "डीप क्लीनिंग और स्वच्छता",
      icon: "sparkles",
      badge: "Top Rated",
      color: "from-fuchsia-500 via-purple-600 to-pink-500",
      description: "Mechanized deep cleaning, sofa & carpet shampooing, modular kitchen degreasing, bathroom descaling.",
      subservices: [
        { id: "c1", name: "Full Home Deep Mechanized Cleaning (2 BHK / 3 BHK)", price: 2499, time: "4-5 hours", warranty: "Single-Day Sparkle Handover" },
        { id: "c2", name: "Intense Bathroom Descaling & Tile Stain Erase (Per Washroom)", price: 499, time: "60 mins", warranty: "Anti-Microbial Shield" },
        { id: "c3", name: "Modular Kitchen Chimney & Degreasing Deep Clean", price: 899, time: "90 mins", warranty: "Food-Grade Solvents" },
        { id: "c4", name: "Fabric / Leather Sofa Shampooing (Per Seat)", price: 199, time: "45 mins", warranty: "Dry-Foam Quick Dry" },
        { id: "c5", name: "Car Interior Deep Vacuum & Steam Sanitization", price: 799, time: "90 mins", warranty: "Spotless Upholstery" }
      ]
    },
    {
      id: "maintenance",
      name: "Handyman & Carpentry",
      nameHindi: "कारपेंटर और मरम्मत सेवा",
      icon: "hammer",
      badge: "Skilled Artisans",
      color: "from-orange-400 via-amber-500 to-red-500",
      description: "Furniture repair, hydraulic hinges, smart digital lock install, sliding wardrobe & modular fixes.",
      subservices: [
        { id: "m1", name: "Door Lock / Smart Digital Lock Installation", price: 349, time: "45 mins", warranty: "Precision Fit" },
        { id: "m2", name: "Hydraulic Hinge & Cabinet Channel Repair", price: 249, time: "30 mins", warranty: "Smooth Glide Guarantee" },
        { id: "m3", name: "Custom Bed / Dining Table Assembly", price: 549, time: "90 mins", warranty: "Structural Rigidity" },
        { id: "m4", name: "Curtain Rod, Mirror, TV Wall Mount Hanging (Up to 3 items)", price: 299, time: "40 mins", warranty: "Laser Level Verified" },
        { id: "m5", name: "Wooden Door Planing & Minor Jamming Fix", price: 299, time: "45 mins", warranty: "Weather-Proof Clearance" }
      ]
    },
    {
      id: "civil-renovation",
      name: "Civil & Renovation",
      nameHindi: "सिविल व मरम्मत कार्य",
      icon: "brick-wall",
      badge: "Engineered",
      color: "from-rose-500 via-orange-600 to-stone-800",
      description: "Wall dampness (सीलन) rectification, structural repairs, Italian marble & vitrified tiles, plastering.",
      subservices: [
        { id: "cr1", name: "Anti-Dampness (सीलन) Chemical Injection & Plaster Treatment", price: 49, unit: "per sq.ft", time: "1-2 days", warranty: "5 Years No-Seelan Guarantee" },
        { id: "cr2", name: "Floor & Wall Tile Laying (Vitrified / Ceramic)", price: 28, unit: "per sq.ft", time: "Contract", warranty: "Laser Level Precision" },
        { id: "cr3", name: "Bathroom Complete Remodel & Waterproofing", price: 18500, time: "5-7 days", warranty: "10 Years Waterproof Bond" },
        { id: "cr4", name: "Wall Demolition & Debris Disposal (Patna municipal compliant)", price: 1499, time: "1 day", warranty: "Safe Debris Transport" }
      ]
    },
    {
      id: "construction",
      name: "Construction & Expansion",
      nameHindi: "भवन निर्माण व विस्तार",
      icon: "building-2",
      badge: "Turnkey BOQ",
      color: "from-blue-600 via-indigo-600 to-slate-900",
      description: "Boundary walls, rooftop floor addition (छत निर्माण), duplexes, commercial godowns with Bihar by-laws.",
      subservices: [
        { id: "co1", name: "Rooftop Extra Floor RCC Construction (Material + Labor)", price: 1450, unit: "per sq.ft", time: "Milestone", warranty: "RERA Compliant Grade" },
        { id: "co2", name: "Boundary Wall & Gate Pier Construction", price: 380, unit: "per running ft", time: "Milestone", warranty: "Seismic Resistant" },
        { id: "co3", name: "Complete Home Turnkey Construction (A-Grade Steel/Cement)", price: 1650, unit: "per sq.ft", time: "Milestone", warranty: "15 Years Structural Warranty" },
        { id: "co4", name: "Architectural 3D Map, Elevation & Nagar Nigam Approval Support", price: 4999, time: "4 days", warranty: "By-Law Certified" }
      ]
    },
    {
      id: "aluminium-glass",
      name: "Aluminium & Glass Work",
      nameHindi: "एल्युमिनियम व ग्लास वर्क",
      icon: "panels-top-left",
      badge: "Modern Architecture",
      color: "from-sky-400 via-cyan-500 to-teal-500",
      description: "Toughened glass office cabins, UPVC & Jindal aluminium sliding windows, spider glazing, balcony glass railings.",
      subservices: [
        { id: "ag1", name: "Toughened 12mm Glass Partition with Patch Fittings", price: 285, unit: "per sq.ft", time: "3 days", warranty: "Saint-Gobain Glass with 5-Year Hardware Warranty" },
        { id: "ag2", name: "Jindal Heavy Section Powder-Coated Sliding Windows", price: 240, unit: "per sq.ft", time: "3 days", warranty: "Smooth Bearing Track" },
        { id: "ag3", name: "SS 304 Balcony Glass Railing (Toughened Laminated)", price: 650, unit: "per running ft", time: "4 days", warranty: "Rust-Free SS 304 Grade" },
        { id: "ag4", name: "Commercial Shopfront Automatic Sensor Glass Door", price: 38500, time: "2 days", warranty: "German Motor 2-Yr Warranty" }
      ]
    },
    {
      id: "painting",
      name: "Painting & Waterproofing",
      nameHindi: "पेंटिंग और वाटरप्रूफिंग",
      icon: "paint-bucket",
      badge: "Asian Paints Certified",
      color: "from-pink-500 via-rose-500 to-purple-600",
      description: "Dustless mechanized sanding, royal luxury sheen, exterior weatherproof Apex Ultima, terrace waterproofing.",
      subservices: [
        { id: "pt1", name: "Interior 3-BHK Royal Luxury Emulsion Package (Labor + Paint)", price: 14999, time: "4-5 days", warranty: "3 Years Mirror Finish Guarantee" },
        { id: "pt2", name: "Exterior Weatherproof Rain-Shield Coating", price: 18, unit: "per sq.ft", time: "Contract", warranty: "5 Years Anti-Fungal Warranty" },
        { id: "pt3", name: "Designer Texture Wall / Metallic Accent Painting", price: 3500, unit: "per wall", time: "1 day", warranty: "Custom Stencil Patterns" },
        { id: "pt4", name: "Roof Terrace Elastomeric Crack-Bridging Waterproofing", price: 38, unit: "per sq.ft", time: "2 days", warranty: "7 Years Leakage Warranty" }
      ]
    },
    {
      id: "fire-safety",
      name: "Fire Safety & Compliance",
      nameHindi: "अग्निशमन व सुरक्षा",
      icon: "flame",
      badge: "Bihar Fire NOC Ready",
      color: "from-red-500 via-rose-600 to-orange-500",
      description: "ISI fire extinguisher refilling, wireless smoke alarms, wet riser systems, safety audits for schools & hospitals.",
      subservices: [
        { id: "fs1", name: "ABC / CO2 Fire Extinguisher Refill & Pressure Testing (Per Cylinder)", price: 499, time: "24 hrs", warranty: "Govt Hydro-Test Certified" },
        { id: "fs2", name: "Commercial Fire Hydrant / Wet Riser Overhaul & Audit", price: 3499, time: "1 day", warranty: "Audit Certificate Issued" },
        { id: "fs3", name: "Wireless Optical Smoke Alarm Installation (Pack of 3)", price: 2199, time: "60 mins", warranty: "10-Year Lithium Battery" },
        { id: "fs4", name: "Bihar Fire Department NOC Consultation & Filing", price: 7500, time: "Express", warranty: "End-to-End Compliance" }
      ]
    },
    {
      id: "cctv",
      name: "CCTV & Electronic Security",
      nameHindi: "सीसीटीवी और सुरक्षा तकनीक",
      icon: "video",
      badge: "Mobile Live View",
      color: "from-teal-400 via-emerald-500 to-cyan-800",
      description: "HD IP cameras, Biometric attendance, night vision color sensors, remote mobile monitoring setup.",
      subservices: [
        { id: "cc1", name: "4-Channel HD IP CCTV Complete Kit + Installation (CP Plus/Hikvision)", price: 9499, time: "4 hours", warranty: "2 Years On-Site Replacement" },
        { id: "cc2", name: "Wi-Fi 360° Smart PTZ Camera Installation (Mobile Control)", price: 2199, time: "45 mins", warranty: "1 Year Instant Support" },
        { id: "cc3", name: "Biometric Fingerprint & Face Attendance Machine for Offices", price: 5499, time: "90 mins", warranty: "Cloud Attendance App Included" },
        { id: "cc4", name: "CCTV Offline Repair, Cable Relaying & DVR Password Reset", price: 499, time: "60 mins", warranty: "Instant Connectivity Fix" }
      ]
    },
    {
      id: "advertising",
      name: "Advertising & Signage",
      nameHindi: "विज्ञापन व साइनेज बोर्ड",
      icon: "megaphone",
      badge: "Business Growth",
      color: "from-violet-500 via-purple-600 to-indigo-600",
      description: "Acrylic LED 3D letter glow-sign boards, hoardings at prime Patna roundabouts, shop front branding, Meta/Google ads.",
      subservices: [
        { id: "ad1", name: "LED 3D Acrylic Letter Glow-Sign Board (Frontlit)", price: 180, unit: "per inch / letter", time: "4 days", warranty: "Samsung LED 2-Year Warranty" },
        { id: "ad2", name: "Vinyl & Flex Eco-Solvent High-Def Banner with Iron Frame", price: 45, unit: "per sq.ft", time: "24 hrs", warranty: "Weather-Resistant UV Inks" },
        { id: "ad3", name: "Prime Patna Hoarding Rental & Printing (Bailey Rd / Boring Canal)", price: 24999, unit: "per month", time: "Monthly", warranty: "Prime Footfall Exposure" },
        { id: "ad4", name: "Hyperlocal Patna Meta & Google Local Ads Campaign Setup", price: 4999, time: "Setup in 48h", warranty: "Guaranteed Local Inquiries" }
      ]
    },
    {
      id: "amc",
      name: "AMC (Annual Maintenance)",
      nameHindi: "वार्षिक रखरखाव अनुबंध",
      icon: "calendar-check",
      badge: "SLA Guaranteed",
      color: "from-amber-500 via-yellow-500 to-orange-600",
      description: "Year-round preventive visits, 45-minute emergency technician SLAs, zero labor charges for Homes, Societies, Hospitals.",
      subservices: [
        { id: "am1", name: "SEVAK Home Shield (1 Year - Electrical + Plumbing + Pest)", price: 4999, unit: "per year", time: "1 Year", warranty: "Unlimited Free Visits & 45m SLA" },
        { id: "am2", name: "Society & Apartment Master AMC (Lift, Generator, Motor, Tanks)", price: 24999, unit: "per year", time: "1 Year", warranty: "Monthly Maintenance + 24/7 Helpline" },
        { id: "am3", name: "Hospital & Healthcare 24/7 Facility Maintenance Contract", price: 49999, unit: "per year", time: "1 Year", warranty: "Dedicated Standby Technician" },
        { id: "am4", name: "Retail & Commercial Showroom Quarterly Preventive Package", price: 12999, unit: "per year", time: "1 Year", warranty: "Quarterly Audit Reports" }
      ]
    },
    {
      id: "b2b-projects",
      name: "B2B Project Services",
      nameHindi: "बी२बी प्रोजेक्ट व टर्नकी",
      icon: "briefcase",
      badge: "GST Compliant",
      color: "from-slate-900 via-indigo-950 to-blue-950",
      description: "Turnkey contracts, Bill of Quantities (BOQ), commercial fitouts, schools, warehouses, GST input credit billing.",
      subservices: [
        { id: "b1", name: "Office / Coworking Full Interior Fit-Out & Cabling", price: 850, unit: "per sq.ft", time: "Turnkey", warranty: "5-Year Turnkey Warranty" },
        { id: "b2", name: "Industrial / Commercial Electrical HT/LT Panel Load Testing", price: 9500, time: "2 days", warranty: "Govt Certified Test Report" },
        { id: "b3", name: "School / Institution Annual Facility Management", price: 65000, unit: "per annum", time: "Annual", warranty: "Dedicated On-Site Team" },
        { id: "b4", name: "Commercial Kitchen Commercial Degreasing & Exhaust Servicing", price: 4999, time: "1 day", warranty: "FSSAI Compliance Ready" }
      ]
    }
  ],

  // AMC Tiered Plans
  amcPlans: [
    {
      id: "home-shield",
      title: "Home Shield Care",
      subtitle: "For Flats & Independent Houses",
      price: 4999,
      billing: "/ year (or ₹499/mo)",
      badge: "Popular for Homes",
      color: "border-amber-400 bg-amber-50/50",
      features: [
        "12 Routine Electrical & Plumbing Preventive Visits",
        "Unlimited Emergency Breakdowns within 45 Minutes",
        "2 Free AC Jet Cleaning Services per year",
        "1 Free Annual Anti-Termite & Herbal Cockroach Shield",
        "Zero Labor Charges on any repairs",
        "Dedicated Relationship Manager in Patna"
      ]
    },
    {
      id: "society-master",
      title: "Society & Apartment Master",
      subtitle: "For RWAs & High-Rise Societies (10-80 Flats)",
      price: 24999,
      billing: "/ year",
      badge: "Best Value for RWAs",
      color: "border-blue-500 bg-blue-50/50",
      features: [
        "Submersible Pumps & Dual Motor Daily Checkups",
        "Underground & Rooftop Water Tank Cleaning (4 times/yr)",
        "Common Area Lighting, MCB & DG Generator Switchover",
        "Common Sump Drainage & Sewer De-clogging",
        "Fire Extinguisher Annual Refill & Pressure Check",
        "Monthly Comprehensive Audit Report for RWA Secretary"
      ]
    },
    {
      id: "enterprise-pro",
      title: "Healthcare & Corporate 24/7",
      subtitle: "For Hospitals, Clinics, Schools & Commercial Hubs",
      price: 49999,
      billing: "/ year",
      badge: "Enterprise Grade",
      color: "border-emerald-600 bg-emerald-50/50",
      features: [
        "24/7 Priority Emergency Dispatch (SLA < 30 mins)",
        "HVAC, Medical Gas Piping & Generator Synchronizer Checks",
        "Fire Safety NOC Compliance & Bi-annual Mock Drills",
        "Full GST Input Tax Credit (18% GST Compliant)",
        "Biometric & CCTV Surveillance System Health Monitoring",
        "Dedicated On-Call Senior Engineer & Monthly Service Audit"
      ]
    }
  ],

  // Turnkey B2B Project Milestones Demo
  b2bProjectDemo: {
    projectId: "B2B-PT-8802",
    title: "Dr. A. N. Memorial Diagnostic Centre - Complete Clinic Fitout",
    client: "Dr. Alok Nath (Patna City)",
    totalBudget: "₹ 14,80,000",
    progress: 72,
    completionTarget: "October 15, 2026",
    milestones: [
      { id: 1, title: "Architectural 3D Layout & Structural Survey", status: "completed", date: "Aug 12, 2026", notes: "Approved by PMC & Structural Engineer" },
      { id: 2, title: "Civil Partitioning, Lead-Lined X-Ray Walls & Plaster", status: "completed", date: "Aug 24, 2026", notes: "Radiation safety testing passed" },
      { id: 3, title: "Electrical Concealed Wiring & Medical Panel Setup", status: "completed", date: "Sep 02, 2026", notes: "Dedicated earthing pits installed" },
      { id: 4, title: "Toughened Glass Cabins & Aluminium Sliding Sections", status: "in-progress", date: "Current Phase", notes: "Installation 75% complete" },
      { id: 5, title: "Antimicrobial Epoxy Flooring & Royal Sheen Painting", status: "pending", date: "Sep 20, 2026", notes: "Materials staged on-site" },
      { id: 6, title: "Final QA Inspection, Fire NOC & Handover", status: "pending", date: "Oct 10, 2026", notes: "Final signoff & GST invoice" }
    ]
  },

  // Verified Local Reviews
  testimonials: [
    {
      id: 1,
      name: "Er. Vivek Vardhan",
      designation: "Resident, Shanti Vihar",
      locality: "Boring Road, Patna",
      service: "AC Jet Service & Inverter Rewiring",
      rating: 5,
      date: "2 days ago",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      review: "In Patna, finding an electrician who arrives on time with genuine tools was impossible until SEVAK. The technician, Rakesh, arrived in 25 minutes, resolved the MCB tripping, and cleaned our 2 ACs with a pressure jet. Transparent billing on app!"
    },
    {
      id: 2,
      name: "Smt. Manju Kumari",
      designation: "School Principal",
      locality: "Kankarbagh, Patna",
      service: "Water Tank Cleaning & CCTV Setup",
      rating: 5,
      date: "1 week ago",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      review: "SEVAK took over our school's water tank descaling and CCTV maintenance. They provided before-and-after photos and UV disinfection. Truly professional service right here in Bihar."
    },
    {
      id: 3,
      name: "Shri Rajesh Agrawal",
      designation: "Secretary, Surya Enclave RWA",
      locality: "Danapur (Near Saguna More), Patna",
      service: "Society Annual Maintenance Contract (AMC)",
      rating: 5,
      date: "2 weeks ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      review: "Our apartment society switched to SEVAK's Society Master AMC. Whenever the submersible pump stops or a common light burns out, a technician arrives within 40 minutes. 100% peace of mind for 48 flats!"
    }
  ],

  // Live Simulated Technicians in Patna
  technicianFleet: [
    {
      id: "TECH-101",
      name: "Rakesh Kumar",
      phone: "+91 94310 88761",
      skills: ["AC Specialist", "Inverter Rewiring", "Heavy Load Panels"],
      rating: 4.95,
      experience: "8 years in Patna",
      policeVerified: true,
      currentLocation: "Boring Canal Road, Patna",
      lat: 25.6120,
      lng: 85.1245
    },
    {
      id: "TECH-102",
      name: "Manoj Paswan",
      phone: "+91 97712 33419",
      skills: ["Master Plumber", "Submersible Pumps", "High Pressure Jet Cleaning"],
      rating: 4.88,
      experience: "11 years in Bihar",
      policeVerified: true,
      currentLocation: "Kankarbagh Main Road, Patna",
      lat: 25.5982,
      lng: 85.1585
    },
    {
      id: "TECH-103",
      name: "Sanjeev Kumar Sinha",
      phone: "+91 94314 55201",
      skills: ["Govt Certified Pest Inspector", "2-Yr Termite Drill Specialist"],
      rating: 4.92,
      experience: "9 years in Patna",
      policeVerified: true,
      currentLocation: "Bailey Road, Raja Bazar, Patna",
      lat: 25.6095,
      lng: 85.0995
    }
  ]
};

// Hindi Localization Translations
const SEVAK_I18N = {
  en: {
    heroTag: "HOME, SOCIETY & B2B SERVICES IN PATNA & BIHAR",
    heroHeading: "One Platform, Every Service",
    heroSubheading: "Electrical, plumbing, pest control, civil, construction, AMC and B2B contracting for homes, societies and businesses across Patna and Bihar.",
    bookNow: "Book Instant Service",
    requestQuote: "Request Project Quote",
    emergencySos: "Need Urgent Help in 30 Mins?",
    trackLive: "My Booking",
    exploreServices: "Explore 14 Core Services",
    searchPlaceholder: "Search for AC repair, plumbing, termite, glass, painting...",
    popularLocations: "Popular Patna Localities",
    trustedBy: "Built for homes, RWAs and institutions across Patna & Bihar",
    amcTitle: "Annual Maintenance Contracts (AMC)",
    amcSubtitle: "Zero Breakdown Headache for Homes, Societies & Commercial Complexes",
    b2bTitle: "Turnkey B2B Project Contracting",
    b2bSubtitle: "Commercial Fitouts, Civil Works, Glass & Expansion with Milestone Tracking",
    viewAdmin: "Admin Operations Command Center"
  },
  hi: {
    heroTag: "पटना और बिहार के लिए घर, सोसायटी और बी२बी सेवाएं",
    heroHeading: "हर काम, अब आसान — एक ही प्लेटफ़ॉर्म पर",
    heroSubheading: "बिजली, प्लंबिंग, सीलन समाधान, निर्माण, ग्लास, पेंटिंग, एएमसी और बी२बी प्रोजेक्ट्स — पूरे पटना व बिहार में समय पर गारंटीड सेवा।",
    bookNow: "तुरंत सेवा बुक करें",
    requestQuote: "प्रोजेक्ट कोटेशन मांगें",
    emergencySos: "क्या ३० मिनट में अर्जेंट मदद चाहिए?",
    trackLive: "मेरी बुकिंग",
    exploreServices: "हमारी १४ प्रमुख सेवाएं देखें",
    searchPlaceholder: "सर्च करें: एसी रिपेयर, प्लंबर, दीमक ट्रीटमेंट, ग्लास, पेंटिंग...",
    popularLocations: "पटना के प्रमुख इलाके",
    trustedBy: "पटना और बिहार के घरों, सोसाइटियों और संस्थानों के लिए",
    amcTitle: "वार्षिक रखरखाव अनुबंध (AMC)",
    amcSubtitle: "घरों, सोसायटियों और हॉस्पिटल्स के लिए २४/७ गारंटीड मेंटेनेंस",
    b2bTitle: "टर्नकी बी२बी प्रोजेक्ट्स एवं निर्माण",
    b2bSubtitle: "ऑफिस इंटीरियर, सिविल रिनोवेशन और ग्लास वर्क्स का रियल-टाइम माइलस्टोन ट्रैकिंग",
    viewAdmin: "एडमिन ऑपरेशंस कमांड सेंटर"
  }
};
