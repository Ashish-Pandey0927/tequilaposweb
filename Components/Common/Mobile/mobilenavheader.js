class MobileNavBar extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.isDropdownOpen = false;
  }

  connectedCallback() {
    this.style.display = 'block';    
    this.loadLocalScript("../assets/js/navbar.js");
    this.render();
    this.setupEventListeners();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    const menu = this.querySelector('#mobile-menu');
    const hamburger = this.querySelector('#hamburger-icon');
    const close = this.querySelector('#close-icon');

    if (this.isOpen) {
      menu.classList.remove('-translate-x-full');
      hamburger.classList.add('hidden');
      close.classList.remove('hidden');
    } else {
      menu.classList.add('-translate-x-full');
      hamburger.classList.remove('hidden');
      close.classList.add('hidden');
    }
  }

loadLocalScript(path) {
    // Check if it's already there to prevent double-loading
    if (document.querySelector(`script[src="${path}"]`)) return;

    const script = document.createElement('script');
    script.src = path;
    script.defer = true; // Best for performance
    document.head.appendChild(script);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    const dropdown = this.querySelector('#dropdownMenu');
    const icon = this.querySelector('#dropdownBtn svg');
    
    dropdown.classList.toggle('hidden', !this.isDropdownOpen);
    icon.classList.toggle('rotate-180', this.isDropdownOpen);
  }

  render() {
    this.innerHTML = `    
      <div class="container mx-auto flex items-center justify-between py-3 px-4">
        <!-- Logo -->
        <a href="/" class="flex items-center">
          <img src="/assets/images/logo/tequila_pos_logo_transparent.png" class="h-10" alt="Logo" />
        </a>

        <!-- Hamburger Button -->
        <button id="mobile-menu-btn" class="p-2 text-black focus:outline-none">
          <svg id="hamburger-icon" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Menu Overlay -->
      <div id="mobile-menu" class="fixed top-0 left-0 h-full w-72 bg-white text-gray-900 transform -translate-x-full transition-transform duration-300 ease-in-out z-50 shadow-2xl overflow-y-auto">
        <div class="p-6 space-y-4">
          
          <!-- Dropdown Section -->
          <div class="relative">
            <button id="dropdownBtn" class="flex justify-between items-center w-full px-4 py-3 bg-gray-50 rounded-lg font-bold text-gray-800 transition-colors">
              Business Type
              <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-gray-500 transition-transform duration-200">
                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>

            <div id="dropdownMenu" class="hidden mt-1 bg-white rounded-lg overflow-hidden border border-gray-100 ml-2">
              <a href="#" class="block px-4 py-3 text-gray-700 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 font-medium">Food & Beverage</a>
              <a href="#" class="block px-4 py-3 text-gray-700 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 font-medium">Retail</a>
            </div>
          </div>

          <!-- Links -->
          <div class="space-y-1">
            <a href="#features" class="block px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-800">Features</a>
            <a href="#hardware" class="block px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-800">Hardware</a>
            <a href="#pricing" class="block px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-800">Pricing</a>
            <a href="/light/resourse.html" class="block px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-800">Resources</a>
          </div>

          <hr class="border-gray-100">

          <!-- Language Switcher -->
          <div class="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-bold">EN</span>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
            <span class="text-sm font-bold">ES</span>
          </div>

          <!-- Footer Actions -->
          <div class="pt-4 space-y-3">
             <a href="/login.html" class="block text-center px-4 py-3 font-bold text-gray-800 hover:text-blue-600">Sign In</a>
             <a href="#demo" class="block text-center bg-black text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
              Free Demo
            </a>
          </div>
        </div>
      </div>

      <!-- Backdrop (to close menu when clicking outside) -->
      <div id="menu-backdrop" class="fixed inset-0 bg-black/20 hidden z-40"></div>
    `;
  }

  setupEventListeners() {
    const btn = this.querySelector('#mobile-menu-btn');
    const dropdownBtn = this.querySelector('#dropdownBtn');
    const backdrop = this.querySelector('#menu-backdrop');

    btn.addEventListener('click', () => {
      this.toggleMenu();
      backdrop.classList.toggle('hidden', !this.isOpen);
    });

    backdrop.addEventListener('click', () => {
      this.toggleMenu();
      backdrop.classList.add('hidden');
    });

    dropdownBtn.addEventListener('click', () => this.toggleDropdown());
  }
}

// Register as mobile-nav-bar
customElements.define('mobile-nav-bar', MobileNavBar);
