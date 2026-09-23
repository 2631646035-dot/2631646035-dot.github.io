const root = document.documentElement;
const themeButton = document.querySelector('.theme-button');
const storedTheme = localStorage.getItem('personal-library-theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (storedTheme === 'light' || (!storedTheme && systemPrefersLight)) {
  root.dataset.theme = 'light';
}

themeButton?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('personal-library-theme', nextTheme);
});

document.querySelector('#year').textContent = new Date().getFullYear();
