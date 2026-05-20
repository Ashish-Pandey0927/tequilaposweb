class WebNavHeader extends HTMLElement {
  constructor() {
    super();
    this.activeCategory = 'food';
  }

  connectedCallback() {
    // 1. Critical: Ensure the custom element has dimensions
    this.style.display = 'block';
    
    this.loadLocalScript("../assets/js/navbar.js");
    this.render();
    this.setupEventListeners();
  }

  loadLocalScript(path) {
    // Check if it's already there to prevent double-loading
    if (document.querySelector(`script[src="${path}"]`)) return;

    const script = document.createElement('script');
    script.src = path;
    script.defer = true; // Best for performance
    document.head.appendChild(script);
  }

  get menuData() {
    return {
      food: {
        discover: ["Overview", "Switch to Tequila"],
        capacity: [
          "Manage order from one place", "Take payment", 
          "Keep customer coming back", "Scale your business", 
          "Improve operation", "Schedule and pay your team", 
          "Manage your cash flow"
        ]
      },
      retail: {
        discover: ["Overview", "Switch to Tequila"],
        capacity: ["Inventory Management", "Supplier Tracking", "Barcode Scanning"]
      }
    };
  }

  setActive(cat) {
    this.activeCategory = cat;
    this.updatePanels();
  }

  updatePanels() {
    const panels = this.querySelectorAll('[data-panel]');
    const links = this.querySelectorAll('[data-cat]');
    
    panels.forEach(p => p.classList.toggle('hidden', p.dataset.panel !== this.activeCategory));
    links.forEach(l => {
      // Toggle styles for active link
      if (l.dataset.cat === this.activeCategory) {
        l.classList.add('underline', 'text-blue-600');
      } else {
        l.classList.remove('underline', 'text-blue-600');
      }
    });
  }

  render() {
    // Note: Removed 'hidden' from nav so you can see it immediately. 
    // Re-add 'md:block hidden' if you only want it on desktop.
    this.innerHTML = `
          <div class="container mx-auto flex items-center justify-between py-2 px-4">
        
        <!-- Left: Logo & Nav -->
        <div class="flex items-center gap-8">
          <a href="/light/index.html">
            <img src="/assets/images/logo/tequila_pos_logo_transparent.png" alt="Logo" class="h-20 w-auto object-contain" />
          </a>

          <div class="flex items-center gap-6">
            <div class="relative group py-4">
              <a href="#business-type" class="font-bold text-gray-800 hover:text-blue-600">Business Type</a>
              
              <!-- Mega Menu -->
              <div class="absolute left-[-100px] top-full bg-white shadow-2xl border-t opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[850px] flex">
                
                <!-- Category List -->
                <div class="w-1/3 bg-gray-50 p-8 border-r">
                  <div class="flex flex-col gap-6">
                    <button class="text-2xl font-bold text-left hover:text-blue-600 transition underline text-blue-600" data-cat="food">Food & Beverage</button>
                    <button class="text-2xl font-bold text-left hover:text-blue-600 transition" data-cat="retail">Retail</button>
                  </div>
                </div>

                <!-- Panels Content -->
                <div class="w-2/3 p-10">
                  ${this.renderPanels()}
                </div>
              </div>
            </div>

            <a href="/light/feature.html" class="font-bold text-gray-800 hover:text-blue-600">Feature</a>
            <a href="/light/hardware.html" class="font-bold text-gray-800 hover:text-blue-600">Hardware</a>
            <a href="/light/pricing.html" class="font-bold text-gray-800 hover:text-blue-600">Pricing</a>
            <a href="/light/resourse.html" class="font-bold text-gray-800 hover:text-blue-600">Resources</a>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 cursor-pointer group">
            <span class="text-sm font-bold">ENGLISH</span>
            <img src="/assets/images/flags/usa.png" alt="USA" class="w-6 h-4 object-cover shadow-sm" />
          </div>
          <a href="/login.html" class="font-bold text-gray-800">Sign in</a>
          <button class="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition">
            Free Demo
          </button>
        </div>
      </div>
    `;
  }

  renderPanels() {
    return Object.entries(this.menuData).map(([key, data]) => `
      <div class="${key === 'food' ? '' : 'hidden'} flex gap-16" data-panel="${key}">
        <div class="flex-1">
          <h6 class="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">Discover</h6>
          <ul class="space-y-3">
            ${data.discover.map(item => `<li><a href="#" class="text-xl font-bold text-gray-900 hover:underline hover:text-blue-600">${item}</a></li>`).join('')}
          </ul>
        </div>
        <div class="flex-[2]">
          <h6 class="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">Capacity</h6>
          <ul class="grid grid-cols-1 gap-3">
            ${data.capacity.map(item => `<li><a href="#" class="text-xl font-bold text-gray-900 hover:underline hover:text-blue-600">${item}</a></li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    this.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('mouseenter', () => this.setActive(btn.dataset.cat));
    });
  }
}

// 2. Critical: Changed to 'web-nav-header' (Must have a hyphen)
customElements.define('web-nav-header', WebNavHeader);
