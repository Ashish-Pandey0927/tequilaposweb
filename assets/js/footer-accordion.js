function toggleAccordion(button) {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  const contentId = button.getAttribute('aria-controls');
  const content = document.getElementById(contentId);

  if (!content) return;

  if (expanded) {
    // Collapse
    button.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = null;
    button.querySelector('svg').style.transform = 'rotate(0deg)';
  } else {
    // Expand
    button.setAttribute('aria-expanded', 'true');
    content.style.maxHeight = content.scrollHeight + 'px';
    button.querySelector('svg').style.transform = 'rotate(180deg)';
  }
}

(function () {
  const THEME_KEY = 'tequila-theme';
  const LIGHT_LOGO = 'assets/images/logo/tequila_pos_logo_transparent.png';
  const DARK_LOGO = 'assets/images/logo/tequila_dark_logo.png';

  // function applyThemeLogos(theme) {
  //   const logoPath = theme === 'dark' ? DARK_LOGO : LIGHT_LOGO;
  //   const logoSelectors = [
  //     'img[data-theme-logo="true"]',
  //     'img[src*="tequila_pos_logo_transparent.png"]',
  //     'img[src*="tequila_dark_logo.png"]',
  //   ];

  //   document.querySelectorAll(logoSelectors.join(', ')).forEach((img) => {
  //     img.src = logoPath;
  //   });
  // }

  function updateToggleLabel(theme) {
    const label = document.getElementById('theme-toggle-label');
    if (label) {
      label.textContent = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  function setTheme(theme) {
    document.body.dataset.theme = theme;
    // applyThemeLogos(theme);
    updateToggleLabel(theme);
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) {
      toggle.checked = theme === 'dark';
    }
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      // Ignore storage failures in restrictive browser modes.
    }

    fetch('theme.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN':
          document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '',
      },
      body: JSON.stringify({ theme }),
      credentials: 'same-origin',
    }).catch(() => {
      // Optional endpoint; ignore when unavailable in static preview.
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const fallbackTheme = document.body.dataset.theme || 'light';
    setTheme(savedTheme || fallbackTheme);

    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    // Capture phase blocks old inline listeners that reload page.
    toggle.addEventListener(
      'change',
      (event) => {
        event.stopImmediatePropagation();
        const nextTheme = event.target.checked ? 'dark' : 'light';
        setTheme(nextTheme);
        persistTheme(nextTheme);
      },
      true
    );
  });
})();
