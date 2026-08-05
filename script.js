/* =============================================================
   CONTACT FORM — HOW TO WIRE THIS UP FOR REAL
   -------------------------------------------------------------
   Right now handleSubmit() only validates the fields and shows a
   fake success message — no email is actually sent. Pick one:

   OPTION A — Formspree (or similar form backend):
     1. Create a form at https://formspree.io and grab your endpoint.
     2. Replace the body of handleSubmit()'s try block with:

        const response = await fetch('https://formspree.io/f/xxxxxxx', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (!response.ok) throw new Error('Request failed');

   OPTION B — mailto fallback (no backend needed):
     Replace handleSubmit() with something that builds a mailto: link
     from the field values and sets window.location to it.

   OPTION C — your own serverless function / API route:
     POST the FormData/JSON to your endpoint the same way as Option A.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initProjectOverlay();
  initMediaModal();
  initContactForm();
  initFooterYear();
  initBackToTop();
});

/* ---------- Nav ---------- */
function initNav(){
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal(){
  const targets = document.querySelectorAll(
    '.project-card, .timeline-entry, .learning-col, .section-head'
  );
  targets.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ---------- Project cards -> detail overlay ----------
   Each card has data-project="slug"; the matching #tpl-slug
   <template> is cloned into the overlay body on click. This keeps
   the card grid compact while giving every project its own
   dedicated space for the full case study, media, and links. */
function initProjectOverlay(){
  const overlay = document.getElementById('project-overlay');
  const closeBtn = document.getElementById('project-overlay-close');
  const body = document.getElementById('project-overlay-body');
  if (!overlay || !body) return;

  let lastFocused = null;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.project;
      const template = document.getElementById(`tpl-${slug}`);
      if (!template) return;

      body.innerHTML = '';
      body.appendChild(template.content.cloneNode(true));
      body.scrollTop = 0;

      lastFocused = card;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    });
  });

  function closeOverlay(){
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    body.innerHTML = '';
    if (lastFocused) lastFocused.focus();
  }

  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeOverlay();
  });
}

/* ---------- Media modal (click a placeholder to preview it larger) ----------
   Uses event delegation on document because most .media-slot elements
   live inside templates that get cloned into the DOM on demand — they
   don't exist yet at DOMContentLoaded. */
function initMediaModal(){
  const modal = document.getElementById('media-modal');
  const closeBtn = document.getElementById('media-modal-close');
  const kindEl = document.getElementById('media-modal-kind');
  const hintEl = document.getElementById('media-modal-hint');
  const captionEl = document.getElementById('media-modal-caption');
  if (!modal) return;

  let lastFocused = null;

  document.addEventListener('click', (e) => {
    const slot = e.target.closest('.media-slot');
    if (!slot) return;

    const kind = slot.querySelector('.media-kind')?.textContent || '';
    const hint = slot.querySelector('.media-hint')?.textContent || '';
    const caption = slot.dataset.caption || '';

    kindEl.textContent = kind;
    hintEl.textContent = hint;
    captionEl.textContent = caption;

    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  });

  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus();
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

/* ---------- Contact form ---------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('.btn-submit');
  const submitLabel = submitBtn.querySelector('.btn-label');

  const fields = {
    name: { el: document.getElementById('name'), validate: v => v.trim().length > 0 || 'Please enter your name.' },
    email: {
      el: document.getElementById('email'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.'
    },
    'project-type': { el: document.getElementById('project-type'), validate: v => v !== '' || 'Please choose an option.' },
    message: { el: document.getElementById('message'), validate: v => v.trim().length >= 10 || 'Message should be at least 10 characters.' }
  };

  Object.entries(fields).forEach(([key, field]) => {
    field.el.addEventListener('blur', () => validateField(key));
    field.el.addEventListener('input', () => clearFieldError(key));
  });

  function validateField(key){
    const field = fields[key];
    const result = field.validate(field.el.value);
    const row = field.el.closest('.form-row');
    const errorEl = document.getElementById(`${key}-error`);

    if (result === true) {
      row.classList.remove('has-error');
      errorEl.textContent = '';
      return true;
    } else {
      row.classList.add('has-error');
      errorEl.textContent = result;
      return false;
    }
  }

  function clearFieldError(key){
    const field = fields[key];
    const row = field.el.closest('.form-row');
    if (row.classList.contains('has-error')) validateField(key);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) {
      statusEl.textContent = 'Please fix the highlighted fields above.';
      statusEl.className = 'form-status is-error';
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      // Placeholder "send" — see the comment block at the top of this
      // file for how to wire this to Formspree, mailto, or your own API.
      await fakeSubmit();

      statusEl.textContent = '> message_sent: true — thanks, I\u2019ll reply within a couple of days.';
      statusEl.className = 'form-status is-success';
      form.reset();
    } catch (err) {
      statusEl.textContent = '> message_sent: false — something went wrong, please email me directly instead.';
      statusEl.className = 'form-status is-error';
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Send message';
    }
  });

  function fakeSubmit(){
    return new Promise(resolve => setTimeout(resolve, 700));
  }
}

/* ---------- Footer year ---------- */
function initFooterYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Back to top ---------- */
function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
