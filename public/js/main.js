// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Mobile hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ── Search tab toggle ─────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── Swap origin / destination ─────────────────────────────
function swapFields() {
  const origin = document.querySelector('input[name="origin"]');
  const dest   = document.querySelector('input[name="destination"]');
  if (origin && dest) {
    [origin.value, dest.value] = [dest.value, origin.value];
  }
}

// ── Newsletter AJAX ───────────────────────────────────────
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg  = document.getElementById('newsletterMsg');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[name="email"]').value;
    try {
      const res  = await fetch('/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (newsletterMsg) {
        newsletterMsg.textContent = data.message;
        newsletterMsg.style.color = data.success ? '#38b6ff' : '#ef4444';
      }
      if (data.success) newsletterForm.reset();
    } catch (err) {
      if (newsletterMsg) newsletterMsg.textContent = 'Something went wrong.';
    }
  });
}

// ── Scroll reveal animation ───────────────────────────────
const revealEls = document.querySelectorAll(
  '.feature-card, .dest-card, .testimonial-card, .flight-card, .contact-card'
);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

// ── Set min date on date inputs ───────────────────────────
document.querySelectorAll('input[type="date"]').forEach(input => {
  const today = new Date().toISOString().split('T')[0];
  input.setAttribute('min', today);
});
