// contact.js — side nav + contact form validation
// Added improved sidenav handling to match other pages (close on link click, touch support)

document.addEventListener('DOMContentLoaded', () => {
  const menuicon = document.getElementById('menuicon');
  const sidenav = document.getElementById('sidenav');
  const closenav = document.getElementById('closenav');

  if (sidenav) {
    // ensure hidden by default
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

    if (menuicon) {
      menuicon.addEventListener('click', (e) => { e.preventDefault(); openMenu(); }, { passive: false });
      menuicon.addEventListener('touchstart', (e) => { e.preventDefault(); openMenu(); }, { passive: false });
    }
    if (closenav) {
      closenav.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });
      closenav.addEventListener('touchstart', (e) => { e.preventDefault(); closeMenu(); }, { passive: false });
    }

    document.addEventListener('click', (e) => {
      if (!sidenav.classList.contains('translate-x-full')) {
        if (!sidenav.contains(e.target) && e.target !== menuicon && !menuicon.contains(e.target)) {
          closeMenu();
        }
      }
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeMenu(); });

    // nav links close and navigate (fixes stuck behaviour)
    const navLinks = sidenav.querySelectorAll('.nav-link');
    navLinks.forEach(a => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const href = a.getAttribute('href');
        closeMenu();
        setTimeout(() => { window.location.href = href; }, 160);
      });
      a.addEventListener('touchstart', (ev) => {
        ev.preventDefault();
        const href = a.getAttribute('href');
        closeMenu();
        setTimeout(() => { window.location.href = href; }, 160);
      }, { passive: false });
    });
  }

  // contact form handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();

      if (!name || !email || !subject) {
        alert('Please fill Name, Email and Subject.');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      alert(`Thanks ${name}, your message has been received (demo).`);
      contactForm.reset();
    });
  }
});
