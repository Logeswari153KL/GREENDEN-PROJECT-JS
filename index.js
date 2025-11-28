// index.js — robust mobile side menu and mini cart count update
document.addEventListener('DOMContentLoaded', () => {
  const menuicon = document.getElementById('menuicon');
  const sidenav = document.getElementById('sidenav');
  const closenav = document.getElementById('closenav');
  const miniCartCount = document.getElementById('miniCartCount');

  if (!sidenav) return;

  // ensure sidenav is hidden by default
  if (!sidenav.classList.contains('translate-x-full') && !sidenav.classList.contains('translate-x-0')) {
    sidenav.classList.add('translate-x-full');
  }

  function openMenu() {
    sidenav.classList.remove('translate-x-full');
    sidenav.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidenav.classList.add('translate-x-full');
    sidenav.classList.remove('translate-x-0');
    document.body.style.overflow = '';
  }

  // attach both click and touchstart for responsiveness
  if (menuicon) {
    menuicon.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu();
    }, { passive: false });

    menuicon.addEventListener('touchstart', (e) => {
      e.preventDefault();
      openMenu();
    }, { passive: false });
  }

  if (closenav) {
    closenav.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });
    closenav.addEventListener('touchstart', (e) => {
      e.preventDefault();
      closeMenu();
    }, { passive: false });
  }

  // close when clicking outside the sidenav
  document.addEventListener('click', (e) => {
    if (!sidenav.classList.contains('translate-x-full')) {
      if (!sidenav.contains(e.target) && e.target !== menuicon && !menuicon.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // hide menu when screen resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMenu();
  });

  // nav links should navigate and close menu (fixes the "stuck" behaviour)
  const navLinks = sidenav.querySelectorAll('.nav-link');
  navLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const href = a.getAttribute('href');
      closeMenu();
      // small timeout to let close animation start, then navigate
      setTimeout(() => {
        window.location.href = href;
      }, 160);
    });
    a.addEventListener('touchstart', (ev) => {
      ev.preventDefault();
      const href = a.getAttribute('href');
      closeMenu();
      setTimeout(() => {
        window.location.href = href;
      }, 160);
    }, { passive: false });
  });

  // update mini cart count from localStorage
  function updateMiniCart() {
    const cart = JSON.parse(localStorage.getItem('greenden_cart') || '[]');
    const totalQty = cart.reduce((s, item) => s + (item.qty || 0), 0);
    if (miniCartCount) miniCartCount.textContent = totalQty;
  }
  updateMiniCart();

  // listen for storage events (when product page updates cart)
  window.addEventListener('storage', (e) => {
    if (e.key === 'greenden_cart') updateMiniCart();
  });
});
