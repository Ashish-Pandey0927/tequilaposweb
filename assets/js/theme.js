// ── Mega-Menu Full-Width / 50vh Override (Desktop & Laptop ≥1024px) ──
// Injected once here so every page that loads theme.js automatically gets
// the correct dropdown geometry – no per-page HTML edits required.
(function () {
  var s = document.createElement('style');
  s.id = 'mega-menu-fullwidth-override';
  s.textContent = [
    /* Only apply on laptop / desktop screens */
    '@media (min-width: 1024px) {',
    '  /*',
    '   * Switch from absolute (constrained by .nav-item) to fixed so the panel',
    '   * can span the full viewport width regardless of the container\'s width.',
    '   * top: 6rem  = the navbar height defined in global.css (.navbar { height: 6rem }).',
    '   */',
    '  .mega-anim {',
    '    position: fixed !important;',
    '    top: 6rem !important;',   /* aligns flush with bottom of sticky navbar  */
    '    left: 0 !important;',
    '    width: 100vw !important;',
    '    height: 50vh !important;',
    '    overflow-y: auto !important;',
    '    border-radius: 0 !important;',  /* flat, full-bleed look */
    '    box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;',
    '    padding: 2rem 4rem !important;', /* generous inner padding */
    '    box-sizing: border-box !important;',
    '  }',
    '  /* The inner flex wrapper should fill the 50vh panel neatly */',
    '  .mega-anim > div {',
    '    height: 100%;',
    '    align-items: flex-start;',
    '  }',
    '}',
    '',
    '.mega-open .mega-anim {',
    '  opacity: 1 !important;',
    '  transform: translateY(0) scale(1) !important;',
    '  visibility: visible !important;',
    '  pointer-events: auto !important;',
    '  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0s linear 0s !important;',
    '}'
  ].join('\n');
  /* Append before </head> so it wins over global.css rules */
  (document.head || document.documentElement).appendChild(s);
})();

// ── Hover-intent fix for fixed-position mega-menus ──
// Because .mega-anim is position:fixed it is detached from .nav-item in the DOM.
// Moving the cursor from the trigger label down into the panel exits .nav-item,
// so the browser loses CSS :hover and the dropdown closes immediately.
// Fix: use a JS close-delay (300 ms) so the user has time to reach the content.
document.addEventListener('DOMContentLoaded', function () {
  var CLOSE_DELAY = 300;

  function wireNavItem(navItem) {
    var panel = navItem.querySelector('.mega-anim');
    if (!panel) return;
    var closeTimer = null;

    function openMenu() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      navItem.classList.add('mega-open');
    }

    function scheduleClose() {
      closeTimer = setTimeout(function () {
        navItem.classList.remove('mega-open');
        closeTimer = null;
      }, CLOSE_DELAY);
    }

    navItem.addEventListener('mouseenter', openMenu);
    navItem.addEventListener('mouseleave', scheduleClose);
    panel.addEventListener('mouseenter', openMenu);
    panel.addEventListener('mouseleave', scheduleClose);
  }

  document.querySelectorAll('.nav-item').forEach(wireNavItem);

  // Expose so the Resources injector (below) can wire its dynamically-created nav-item
  window.__wireNavItem = wireNavItem;
});

// ── Global Tailwind Configuration Override ──
// This forces the 'xl' breakpoint (used by the navbar) to trigger at 1024px instead of 1280px.
// This ensures that the desktop navbar shows on all laptops (13-inch, 15-inch, etc) 
// instead of the hamburger menu.
window.tailwind = {
  config: {
    theme: {
      extend: {
        screens: {
          'xl': '1024px',
        }
      }
    }
  }
};

(function () {
  // ── Apply saved theme immediately (before paint) to prevent flash ──
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

// ── Wire up the toggle once DOM is ready ──
function updateToggleLabel(isDark) {
  const label = document.getElementById('theme-toggle-label');
  if (label) {
    label.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('dark-mode-toggle');
  if (!toggle) return;

  // Set toggle state to match current theme
  const isDark = document.documentElement.classList.contains('dark');
  toggle.checked = isDark;
  updateToggleLabel(isDark);

  toggle.addEventListener('change', function () {
    if (this.checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updateToggleLabel(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      updateToggleLabel(false);
    }
  });
});

// ── Global Language Switcher via Google Translate ──
document.addEventListener('DOMContentLoaded', function () {
  // 1. Inject CSS to hide Google Translate widget and prevent body layout shifts
  const style = document.createElement('style');
  style.innerHTML = `
    .goog-te-banner-frame.skiptranslate, 
    .goog-te-banner-frame,
    .VIpgJd-ZVi9od-ORHb-OEVmcd,
    #goog-gt-tt, 
    .goog-te-balloon-frame { 
      display: none !important; 
    }
    body { 
      top: 0px !important; 
      position: static !important; 
      margin-top: 0px !important; 
    }
    html {
      top: 0px !important;
      position: static !important;
      margin-top: 0px !important;
    }
    .goog-te-combo { display: none !important; }
    .goog-tooltip { display: none !important; }
    .goog-tooltip:hover { display: none !important; }
    .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
  `;
  document.head.appendChild(style);

  // 2. Add the translation container div
  const translateDiv = document.createElement('div');
  translateDiv.id = 'google_translate_element';
  translateDiv.style.display = 'none';
  document.body.appendChild(translateDiv);

  // 3. Define the init function for Google Translate
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,es',
      autoDisplay: false
    }, 'google_translate_element');
    
    // Automatically trigger translation if a saved language is found
    setTimeout(restoreLanguage, 1000);
  };

  // 4. Inject Google Translate script
  const script = document.createElement('script');
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(script);

  // 5. Language toggle logic
  function updateLanguageUI(isEnglish) {
    // Update all instances of the language text and flag (desktop and mobile)
    const textEls = document.querySelectorAll("#language-text, #mobile-language-text");
    const flagEls = document.querySelectorAll("#flag-icon, #mobile-flag-icon");
    const selectors = document.querySelectorAll('.language-selector');
    
    textEls.forEach(el => {
      el.textContent = isEnglish ? "ENGLISH" : "ESPAÑOL";
    });
    
    flagEls.forEach(el => {
      if (isEnglish) {
        el.src = "/assets/images/flags/usa.png";
        el.alt = "USA";
      } else {
        el.src = "/assets/images/flags/espan.png";
        el.alt = "Spain";
      }
    });

    // For mobile sidebar: we want it to act like a full-width row with space-between
    selectors.forEach(selector => {
      selector.style.display = 'flex';
      selector.style.alignItems = 'center';
      if (!selector.style.gap) selector.style.gap = '8px';
      
      // If this is the mobile language selector, stretch it out so the flag doesn't jump around
      if (selector.closest('#mobile-menu')) {
        selector.style.justifyContent = 'space-between';
        selector.style.width = '100%';
      }
    });
  }

  function doGTranslate(targetLang) {
    if (window.google && google.translate) {
      const select = document.querySelector('select.goog-te-combo');
      if (select) {
        select.value = targetLang;
        select.dispatchEvent(new Event('change'));
      }
    }
  }

  function restoreLanguage() {
    const savedLang = localStorage.getItem('site_lang') || 'en';
    const isEnglish = savedLang === 'en';
    updateLanguageUI(isEnglish);
    if (savedLang === 'es') {
      doGTranslate('es');
    }
  }

  window.handleGlobalLanguageToggle = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const savedLang = localStorage.getItem('site_lang') || 'en';
    const isEnglish = savedLang === 'en';
    
    if (isEnglish) {
      // Switch to Spanish
      localStorage.setItem('site_lang', 'es');
      updateLanguageUI(false);
      doGTranslate('es');
    } else {
      // Switch to English
      localStorage.setItem('site_lang', 'en');
      updateLanguageUI(true);
      
      // To properly restore original content without Google Translate artifacts, 
      // the most robust way is to clear the cookies and reload the page.
      document.cookie = "googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=/en/es; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (document.domain) {
        document.cookie = "googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + document.domain;
        document.cookie = "googtrans=/en/es; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + document.domain;
      }
      
      // Force reload to completely clear translation
      window.location.reload();
    }
  };

  // 6. Hook up the existing selectors and override the inline onclick="toggleLanguage()"
  const selectors = document.querySelectorAll('.language-selector');
  selectors.forEach(selector => {
    // Remove the inline onclick attribute so it doesn't conflict
    selector.removeAttribute('onclick');
    // Add our global event listener
    selector.addEventListener('click', window.handleGlobalLanguageToggle);
  });
});

// ── Resources Mega-Menu Injection ──
// Runs on every page that loads theme.js (desktop navbar only, ≥1024px).
// Finds the plain <a href="/resourse.html">Resources</a> nav-link and
// replaces it with a full mega-menu dropdown matching the Business Type style.
document.addEventListener('DOMContentLoaded', function () {
  // Only inject on the desktop navbar (xl:block hidden nav)
  // Look for the Resources link inside the desktop nav (.navbar.xl\\:block)
  var desktopNavs = document.querySelectorAll('nav.navbar');
  var resourcesLink = null;

  desktopNavs.forEach(function (nav) {
    // The desktop nav has class "xl:block hidden" – pick the one that is NOT xl:hidden
    if (!nav.classList.contains('xl:hidden')) {
      var links = nav.querySelectorAll('a.nav-link');
      links.forEach(function (link) {
        if (link.textContent.trim() === 'Resources') {
          resourcesLink = link;
        }
      });
    }
  });

  if (!resourcesLink) return; // Guard: if no Resources link found, stop.

  // Build the mega-menu wrapper HTML (mirrors Business Type dropdown structure)
  var wrapper = document.createElement('div');
  wrapper.className = 'nav-item relative group';

  wrapper.innerHTML = [
    '<a href="/resourse.html" class="nav-link">Resources</a>',
    '<div class="mega-menu mega-anim absolute left-0 top-full pt-10">',
    '  <div class="flex flex-nowrap gap-10">',

    // ── Left column: category links ──
    '    <div class="flex flex-col p-10 gap-4">',
    '      <a href="/resourse.html#blogs"    class="text-[26px] font-bold hover:underline" style="color:inherit">Blogs</a>',
    '      <a href="/resourse.html#tutorials" class="text-[26px] font-bold hover:underline" style="color:inherit">Tutorials</a>',
    '      <a href="/resourse.html#manuals"  class="text-[26px] font-bold hover:underline" style="color:inherit">Manuals</a>',
    '    </div>',

    // ── Right column: Discover + blog post links ──
    '    <div class="flex gap-16 p-10">',
    '      <div>',
    '        <h6 class="text-xs font-normal mb-[10px]" style="color:inherit">Discover</h6>',
    '        <ul class="space-y-3 text-sm">',
    '          <li><a href="/blog-one.html"  class="hover:underline text-base font-bold" style="color:inherit">Cash Discount vs Traditional Processing &ndash; Which One Saves You More?</a></li>',
    '          <li><a href="/blog-two.html"  class="hover:underline text-base font-bold" style="color:inherit">How This Restaurant Cut Credit Card Fees by 30% with TequilaPOS</a></li>',
    '          <li><a href="/blog-three.html" class="hover:underline text-base font-bold" style="color:inherit">5 Features Your Restaurant POS Must Have (That Ours Does)</a></li>',
    '          <li><a href="/blog-four.html" class="hover:underline text-base font-bold" style="color:inherit">Stop Employee Theft Before It Starts: Tools You Already Have</a></li>',
    '          <li><a href="/blog-five.html" class="hover:underline text-base font-bold" style="color:inherit">Why Accepting Bitcoin Is the Future of Restaurant Payments</a></li>',
    '          <li><a href="/blog-six.html"  class="hover:underline text-base font-bold" style="color:inherit">Free Download: Weekly Sales &amp; Expense Tracker for Restaurant Owners</a></li>',
    '        </ul>',
    '      </div>',
    '    </div>',

    '  </div>',
    '</div>'
  ].join('\n');

  // Replace the plain <a> tag with the full nav-item wrapper
  resourcesLink.parentNode.replaceChild(wrapper, resourcesLink);

  // Apply the hover-intent delay to the newly created Resources nav-item
  if (typeof window.__wireNavItem === 'function') {
    window.__wireNavItem(wrapper);
  }
});// ── Mobile Resources Accordion Injection ──
// Runs on every page that loads theme.js (mobile menu).
// Finds the plain <a href="/resourse.html">Resources</a> nav-link in the mobile menu and
// replaces it with a full accordion dropdown matching the Business Type style.
document.addEventListener('DOMContentLoaded', function () {
  var mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;

  var mobileLinks = mobileMenu.querySelectorAll('a');
  var resourcesLinkMobile = null;
  mobileLinks.forEach(function (link) {
    if (link.textContent.trim() === 'Resources' && link.getAttribute('href') === '/resourse.html') {
      resourcesLinkMobile = link;
    }
  });

  if (!resourcesLinkMobile) return;

  var wrapper = document.createElement('div');
  wrapper.className = 'mobile-nav-accordion';

  wrapper.innerHTML = [
    '<button class="accordion-header flex justify-between items-center w-full px-4 py-3 font-bold text-lg" style="color: var(--text-primary)">',
    '  Resources',
    '  <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 transition-transform duration-200">',
    '    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" />',
    '  </svg>',
    '</button>',
    '<div class="accordion-content hidden border-l-2 border-gray-200 ml-4 py-2">',
    '  <a href="/resourse.html#blogs" class="block py-2 px-4 text-sm font-semibold">Blogs</a>',
    '  <a href="/resourse.html#tutorials" class="block py-2 px-4 text-sm font-semibold">Tutorials</a>',
    '  <a href="/resourse.html#manuals" class="block py-2 px-4 text-sm font-semibold">Manuals</a>',
    '  <div class="mt-2 pl-4 border-t border-gray-100 pt-2">',
    '    <h6 class="text-[10px] uppercase opacity-60 font-normal mb-2">Discover</h6>',
    '    <div class="space-y-3">',
    '      <a href="/blog-one.html" class="block text-sm font-bold">Cash Discount vs Traditional...</a>',
    '      <a href="/blog-two.html" class="block text-sm font-bold">How This Restaurant Cut...</a>',
    '      <a href="/blog-three.html" class="block text-sm font-bold">5 Features Your Restaurant...</a>',
    '      <a href="/blog-four.html" class="block text-sm font-bold">Stop Employee Theft Before...</a>',
    '      <a href="/blog-five.html" class="block text-sm font-bold">Why Accepting Bitcoin Is...</a>',
    '      <a href="/blog-six.html" class="block text-sm font-bold">Free Download: Weekly Sales...</a>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  resourcesLinkMobile.parentNode.replaceChild(wrapper, resourcesLinkMobile);

  // Wire up the new accordion button
  var header = wrapper.querySelector('.accordion-header');
  header.addEventListener('click', function (e) {
    var content = this.nextElementSibling;
    var icon = this.querySelector('svg');
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      if (icon) icon.classList.add('rotate-180');
    } else {
      content.classList.add('hidden');
      if (icon) icon.classList.remove('rotate-180');
    }
  });
});
