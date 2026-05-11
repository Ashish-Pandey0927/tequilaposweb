// ── Global Tailwind Configuration Override ──
// This forces the 'xl' breakpoint (used by the navbar) to trigger at 1024px instead of 1280px.
// This ensures that the desktop navbar shows on all laptops (13-inch, 15-inch, etc) 
// instead of the hamburger menu.
window.tailwind = {
  theme: {
    extend: {
      screens: {
        'xl': '1024px',
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

    // Reorder the flag and text without breaking layout
    selectors.forEach(selector => {
      selector.style.display = 'flex';
      selector.style.alignItems = 'center';
      if (!selector.style.gap) selector.style.gap = '8px';

      const span = selector.querySelector('span');
      const img = selector.querySelector('img');
      
      if (span && img) {
        if (isEnglish) {
          // English: Flag on left, Text on right
          selector.insertBefore(img, span);
        } else {
          // Spanish: Text on left, Flag on right
          selector.insertBefore(span, img);
        }
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