const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.view-button').forEach((button) => {
  button.addEventListener('click', () => {
    const originalText = button.innerHTML;
    button.textContent = `${button.dataset.product} selected`;
    button.style.color = 'var(--coral)';
    window.setTimeout(() => {
      button.innerHTML = originalText;
      button.style.color = '';
    }, 1800);
  });
});