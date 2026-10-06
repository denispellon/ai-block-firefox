let currentLang = localStorage.getItem('pref-lang') || 'fr';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('pref-lang', lang);

  document.querySelectorAll('[data-fr][data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
  }
}

function toggleLanguage() {
  setLanguage(currentLang === 'fr' ? 'en' : 'fr');
}

document.addEventListener('DOMContentLoaded', () => setLanguage(currentLang));