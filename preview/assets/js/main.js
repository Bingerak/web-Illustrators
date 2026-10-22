/* Tening Boris — site interactions. No dependencies, ~4 KB. */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- mobile navigation ---------- */
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (toggle && nav) {
    const mq = window.matchMedia('(max-width: 880px)');
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      if (open) { const first = nav.querySelector('a'); first && first.focus(); }
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
      // keep focus inside the open menu
      if (e.key === 'Tab' && nav.classList.contains('is-open') && mq.matches) {
        const items = [toggle, ...$$('a, button', nav)];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    mq.addEventListener('change', () => setOpen(false));
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = $$('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reveals.length && 'IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- work filters ---------- */
  const filters = $$('.filter');
  if (filters.length) {
    const cards = $$('.work-card');
    const empty = $('.work-grid__empty');
    const status = $('#filter-status');
    const apply = (id, push) => {
      let shown = 0;
      filters.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filter === id)));
      cards.forEach((c) => { const ok = id === 'all' || c.dataset.category === id; c.hidden = !ok; if (ok) shown++; });
      if (empty) empty.hidden = shown !== 0;
      if (status) status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
      if (push) history.replaceState(null, '', id === 'all' ? location.pathname : `${location.pathname}?type=${id}`);
    };
    filters.forEach((f) => f.addEventListener('click', () => apply(f.dataset.filter, true)));
    const initial = new URLSearchParams(location.search).get('type');
    if (initial && filters.some((f) => f.dataset.filter === initial)) apply(initial, false);
  }

  /* ---------- contact form ---------- */
  const form = $('#enquiry-form');
  if (form) {
    const statusBox = $('#form-status');
    const submitBtn = $('button[type="submit"]', form);
    const waNumber = form.dataset.whatsapp;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const rules = {
      name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
      email: (v) => (!v.trim() ? 'Please enter your email so I can reply.' : !emailRe.test(v.trim()) ? 'That email address looks incomplete. Check for a missing @ or domain.' : ''),
      project_type: (v) => (!v ? 'Please choose the type of project.' : ''),
      message: (v) => (v.trim().length < 20 ? 'Please add a few more details (at least 20 characters) about what you need.' : ''),
    };

    const showError = (field, msg) => {
      const input = form.elements[field];
      const err = $(`#${field}-error`);
      if (!input || !err) return;
      err.textContent = msg;
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    };
    const validateField = (field) => { const msg = rules[field](form.elements[field].value); showError(field, msg); return !msg; };

    Object.keys(rules).forEach((field) => {
      const input = form.elements[field];
      input.addEventListener('blur', () => { if (input.value || input.hasAttribute('aria-invalid')) validateField(field); });
      input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) validateField(field); });
      input.addEventListener('change', () => { if (input.hasAttribute('aria-invalid')) validateField(field); });
    });

    const validateAll = () => {
      const bad = Object.keys(rules).filter((f) => !validateField(f));
      if (bad.length) form.elements[bad[0]].focus();
      return bad.length === 0;
    };

    const waText = () => {
      const d = new FormData(form);
      return [
        `Hello Boris, I'm ${d.get('name') || ''}.`,
        d.get('project_type') ? `Project: ${d.get('project_type')}` : '',
        d.get('budget') ? `Budget: ${d.get('budget')}` : '',
        '',
        d.get('message') || '',
        '',
        d.get('email') ? `Email: ${d.get('email')}` : '',
      ].filter((l, i, a) => l !== '' || (a[i - 1] !== '' && i > 0)).join('\n');
    };
    const waLink = () => `https://wa.me/${waNumber}?text=${encodeURIComponent(waText())}`;

    $('#send-whatsapp')?.addEventListener('click', () => {
      statusBox.textContent = '';
      if (!validateField('name') || !validateField('message')) {
        (form.elements.name.hasAttribute('aria-invalid') ? form.elements.name : form.elements.message).focus();
        return;
      }
      window.open(waLink(), '_blank', 'noopener');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusBox.textContent = '';
      statusBox.className = 'form-status';
      if (form.elements.company_website && form.elements.company_website.value) return; // honeypot
      if (!validateAll()) {
        statusBox.className = 'form-status form-status--error';
        statusBox.textContent = 'Please fix the highlighted fields and try again.';
        return;
      }
      const label = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…';
      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        const res = await fetch(form.getAttribute('action') || '/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' },
          body,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const success = $('#form-success');
        $('#success-name').textContent = (form.elements.name.value.trim().split(' ')[0]) || 'there';
        form.hidden = true;
        success.hidden = false;
        success.focus();
        form.reset();
      } catch (err) {
        statusBox.className = 'form-status form-status--error';
        statusBox.innerHTML = `Sorry, your message could not be sent just now. Your details are still in the form. You can <a href="${waLink()}" target="_blank" rel="noopener">send them on WhatsApp</a> or email <a href="mailto:${form.dataset.email}">${form.dataset.email}</a>.`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = label;
      }
    });
  }

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
