const root = document.documentElement;
const themeButton = document.querySelector('.theme-button');
const storedTheme = localStorage.getItem('personal-library-theme');
if (storedTheme === 'light') {
  root.dataset.theme = 'light';
}

themeButton?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('personal-library-theme', nextTheme);
});

document.querySelector('#year').textContent = new Date().getFullYear();
