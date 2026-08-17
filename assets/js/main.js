/* ==========================================================================
   main.js — Borehamwood Chiropody & Podiatry
   Vanilla JS, zero dependencies. Sections:
     1. CSV loader (Google Sheets ready)
     2. Icon set
     3. Renderers: conditions · fees · FAQs · opening hours
     4. Header: mobile nav, stuck state, scrollspy
     5. Reveal-on-scroll
     6. <dialog> lightbox
     7. Formspree submit
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  /* ====================================================== 1. CSV LOADER == */
  /* Same approach used on karatekidshemel.co.uk and pottersbargarage.co.uk:
     a hand-rolled parser, no library. Handles quoted fields, embedded commas,
     escaped double quotes, and embedded newlines inside quoted cells.        */

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (inQuote) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cell += '"'; i++; }
          else { inQuote = false; }
        } else {
          cell += ch;
        }
        continue;
      }

      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); cell = '';
        rows.push(row); row = [];
      } else {
        cell += ch;
      }
    }
    row.push(cell);
    rows.push(row);

    return rows.filter((r) => r.some((c) => c.trim() !== ''));
  }

  /* Turn a CSV string into an array of objects keyed by lower-cased header. */
  function csvToObjects(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    const headers = rows[0].map((h) => h.trim().toLowerCase());
    return rows.slice(1).map((cells) =>
      headers.reduce((obj, h, i) => {
        obj[h] = (cells[i] || '').trim();
        return obj;
      }, {})
    );
  }

  /* Normalise the hardcoded phase-1 rows to the same shape as CSV output. */
  function normalise(rows) {
    return rows.map((r) =>
      Object.keys(r).reduce((o, k) => {
        o[k.trim().toLowerCase()] = typeof r[k] === 'string' ? r[k] : String(r[k] ?? '');
        return o;
      }, {})
    );
  }

  /* Public entry point. Phase 1: `url` is empty, resolves to `rows`.
     Phase 2: fetches the published CSV, falls back to `rows` on any error.   */
  async function loadDataset(dataset) {
    const fallback = normalise(dataset.rows || []);
    if (!dataset.url) return { rows: fallback, source: 'local' };
    try {
      const res = await fetch(dataset.url, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const rows = csvToObjects(await res.text());
      if (!rows.length) throw new Error('empty sheet');
      return { rows, source: 'sheet' };
    } catch (err) {
      console.warn('[BWC] Sheet load failed, using local data:', err.message);
      return { rows: fallback, source: 'fallback' };
    }
  }

  /* Shared row filters: drop hidden rows, sort by numeric `order` if present. */
  function usable(rows) {
    return rows
      .filter((r) => (r.status || '').toLowerCase() !== 'hide')
      .sort((a, b) => (parseFloat(a.order) || 0) - (parseFloat(b.order) || 0));
  }

  /* ========================================================== 2. ICONS === */
  const ICONS = {
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
    scissors: '<circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M20 4 8.6 16.4M20 20 8.6 7.6"/>',
    pulse: '<path d="M2 12h4l3-8 4 16 3-8h6"/>',
    virus: '<circle cx="12" cy="12" r="6"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19"/>',
    laser: '<path d="M12 2v5"/><path d="M8.5 8.5h7l1.5 4a5 5 0 0 1-10 0Z"/><path d="M12 17v5M8 20.5h8"/>',
    droplet: '<path d="M12 3s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10Z"/>',
    arch: '<path d="M3 19c0-7 4-12 9-12s9 5 9 12"/><path d="M3 19h18"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.2 2.9 8 7 9.5 4.1-1.5 7-5.3 7-9.5V6Z"/>',
    crack: '<path d="M4 4h16v16H4z" opacity=".25"/><path d="m9 3 2.5 6L8 12l4 3-1.5 6"/>',
    heart: '<path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.6 12 20 12 20Z"/>',
    dot: '<circle cx="12" cy="12" r="7"/>',

    stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M6 3H4M14 3h2M10 12v3a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="11" r="2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    coins: '<ellipse cx="12" cy="6.5" rx="7" ry="3"/><path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/><path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V20H4Z"/><path d="M10 20v-5h4v5"/>',
    sparkle: '<path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18.2l-1.8-5.6L4.7 10.8 10.2 9Z"/>',
    tag: '<path d="M3 11.5V4h7.5l10 10-7.5 7.5Z"/><circle cx="7.5" cy="7.5" r="1.4"/>'
  };

  const svg = (key, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
      ICONS[key] || ICONS.dot
    }</svg>`;

  /* Pick a group icon by keyword so new sheet groups still get something. */
  function groupIcon(name) {
    const n = name.toLowerCase();
    if (n.includes('laser')) return 'laser';
    if (n.includes('verruca')) return 'virus';
    if (n.includes('nail') || n.includes('orthotic')) return 'shield';
    if (n.includes('home')) return 'home';
    return 'stethoscope';
  }

  /* ======================================================= 3. RENDERERS == */

  /* ---- Conditions: auto-flowing 3-up grid, one card per data row -------- */
  async function renderConditions() {
    const grid = $('#conditionsGrid');
    if (!grid) return;

    const { rows } = await loadDataset(window.BWC_DATA.conditions);
    const list = usable(rows);

    if (!list.length) {
      grid.innerHTML = `<p class="state">Condition list unavailable — please call the practice on
        <a href="tel:+442089539052">020 8953 9052</a> and we'll talk you through it.</p>`;
      return;
    }

    grid.innerHTML = list
      .map(
        (c) => `
        <article class="condition reveal">
          <div class="condition-top">
            <span class="condition-icon">${svg(c.icon)}</span>
            <h3>${esc(c.name)}</h3>
          </div>
          <p>${esc(c.description)}</p>
          ${c.category ? `<span class="condition-tag">${esc(c.category)}</span>` : ''}
        </article>`
      )
      .join('');

    observeReveals(grid);
  }

  /* ---- Fees: grouped rows, table length follows the data --------------- */
  async function renderFees() {
    const host = $('#feesGroups');
    if (!host) return;

    const dataset = window.BWC_DATA.fees;
    const { rows } = await loadDataset(dataset);
    const list = usable(rows);

    if (!list.length) {
      host.innerHTML = `<p class="state">Fee list unavailable — please call
        <a href="tel:+442089539052">020 8953 9052</a> for current prices.</p>`;
      return;
    }

    /* Group preserving first-seen order. */
    const groups = new Map();
    for (const row of list) {
      const key = row.group || 'Treatments';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    }

    host.innerHTML = [...groups]
      .map(
        ([name, items]) => `
        <section class="fees-group reveal">
          <header class="fees-group-head">
            ${svg(groupIcon(name))}
            <h3>${esc(name)}</h3>
          </header>
          ${items
            .map(
              (f) => `
            <div class="fee-row">
              <div class="fee-name">
                ${esc(f.treatment)}
                ${f.note ? `<span class="fee-note">${esc(f.note)}</span>` : ''}
              </div>
              <div class="fee-price">${esc(f.price)}</div>
            </div>`
            )
            .join('')}
        </section>`
      )
      .join('');

    const notesHost = $('#feesNotes');
    if (notesHost && dataset.notes?.length) {
      notesHost.innerHTML = dataset.notes.map((n) => `<li>${esc(n)}</li>`).join('');
    }

    observeReveals(host);
  }

  /* ---- FAQs: native <details> accordion --------------------------------- */
  async function renderFaqs() {
    const host = $('#faqList');
    if (!host) return;

    const { rows } = await loadDataset(window.BWC_DATA.faqs);
    const list = usable(rows);

    if (!list.length) {
      host.innerHTML = `<p class="state">We couldn't load the FAQs — please
        <a href="#contact">get in touch</a> and we'll answer directly.</p>`;
      return;
    }

    host.innerHTML = list
      .map((f, i) => {
        const body = String(f.answer || '')
          .split(/\n\s*\n/)
          .map((p) => `<p>${esc(p.trim())}</p>`)
          .join('');
        return `
        <details class="faq reveal"${i === 0 ? ' open' : ''}>
          <summary>${esc(f.question)}</summary>
          <div class="faq-body">${body}</div>
        </details>`;
      })
      .join('');

    /* Also emit FAQPage structured data so the answers can win rich results. */
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: list.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: String(f.answer || '').replace(/\s+/g, ' ').trim() }
      }))
    };
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(ld);
    document.head.appendChild(tag);

    observeReveals(host);
  }

  /* ---- Opening hours: one row per data row, today highlighted ----------- */
  async function renderHours() {
    const host = $('#hoursList');
    if (!host) return;

    const { rows } = await loadDataset(window.BWC_DATA.hours);
    const list = usable(rows);
    if (!list.length) return;

    const todayName = new Date().toLocaleDateString('en-GB', { weekday: 'long' });

    host.innerHTML = list
      .map((h) => {
        const closed = !h.open || !h.close;
        const time = closed ? h.note || 'Closed' : `${h.open} – ${h.close}`;
        const isToday = h.day.trim().toLowerCase() === todayName.toLowerCase();
        return `
        <div class="hours-row${isToday ? ' is-today' : ''}${closed ? ' is-closed' : ''}">
          <span class="hours-day">${esc(h.day)}</span>
          <span class="hours-time">${esc(time)}</span>
        </div>`;
      })
      .join('');
  }

  /* ==================================================== 4. HEADER / NAV == */
  function initHeader() {
    const header = $('#siteHeader');
    const toggle = $('#navToggle');
    const nav = $('#nav');
    if (!header) return;

    /* Keep --header-h honest so scroll-padding-top matches reality. */
    const syncHeight = () => {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    syncHeight();
    if ('ResizeObserver' in window) new ResizeObserver(syncHeight).observe(header);

    /* Stuck state — a zero-height sentinel above the header beats scroll events. */
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinel);
    new IntersectionObserver(
      ([e]) => header.classList.toggle('is-stuck', !e.isIntersecting),
      { threshold: 0 }
    ).observe(sentinel);

    /* Mobile menu */
    if (toggle && nav) {
      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
      };
      toggle.addEventListener('click', () =>
        setOpen(toggle.getAttribute('aria-expanded') !== 'true')
      );
      nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
      });
      document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) setOpen(false);
      });
      matchMedia('(min-width: 1061px)').addEventListener('change', () => setOpen(false));
    }

    /* Scrollspy — highlight the nav link for the section in view. */
    const links = $$('.nav-links a[href^="#"]');
    const targets = links
      .map((a) => ({ link: a, section: document.getElementById(a.hash.slice(1)) }))
      .filter((t) => t.section);
    if (!targets.length) return;

    let active = null;
    const setActive = (link) => {
      if (active === link) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      if (link) link.setAttribute('aria-current', 'true');
      active = link;
    };

    const visible = new Map();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.set(e.target, e.intersectionRatio);
          else visible.delete(e.target);
        });
        if (!visible.size) return;
        /* Topmost visible section wins, so the highlight tracks reading order. */
        const top = [...visible.keys()].sort(
          (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
        )[0];
        setActive(targets.find((t) => t.section === top)?.link || null);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    targets.forEach((t) => spy.observe(t.section));
  }

  /* ================================================ 5. REVEAL ON SCROLL == */
  let revealObserver = null;

  function observeReveals(root = document) {
    if (!revealObserver) {
      if (
        !('IntersectionObserver' in window) ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        $$('.reveal', root).forEach((el) => el.classList.add('is-in'));
        return;
      }
      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-in');
            obs.unobserve(e.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
      );
    }
    $$('.reveal:not(.is-in)', root).forEach((el, i) => {
      el.style.transitionDelay = Math.min(i, 6) * 55 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ====================================================== 6. LIGHTBOX ==== */
  /* Native <dialog>: focus trap, Esc-to-close and inert background are free. */
  function initLightbox() {
    const dlg = $('#lightbox');
    if (!dlg || typeof dlg.showModal !== 'function') return;

    const img = $('#lightboxImg', dlg);
    const cap = $('#lightboxCap', dlg);

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox]');
      if (trigger) {
        const source = trigger.querySelector('img') || trigger;
        img.src = trigger.dataset.lightbox || source.src;
        img.alt = source.alt || '';
        cap.textContent = trigger.dataset.caption || source.alt || '';
        dlg.showModal();
        return;
      }
      /* Click on the backdrop (i.e. the dialog element itself) closes it. */
      if (e.target === dlg) dlg.close();
    });

    $('#lightboxClose', dlg)?.addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => { img.removeAttribute('src'); });
  }

  /* ======================================================= 7. THE FORM === */
  function initForm() {
    const form = $('#contactForm');
    if (!form) return;

    const status = $('#formStatus');
    const button = form.querySelector('[type="submit"]');
    const original = button ? button.textContent : '';

    const say = (msg, ok) => {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form-status is-visible ' + (ok ? 'is-ok' : 'is-err');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.reportValidity()) return;
      /* Honeypot: real people leave it empty. */
      if (form.elements._gotcha && form.elements._gotcha.value) return;

      if (button) { button.disabled = true; button.textContent = 'Sending…'; }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.errors?.map((x) => x.message).join(', ') || 'Send failed');
        }
        form.reset();
        say(
          "Thank you — your message has been sent. We'll be in touch shortly to confirm your appointment.",
          true
        );
      } catch (err) {
        say(
          'Sorry, something went wrong sending your message. Please call us on 020 8953 9052 or 07815 157055 instead.',
          false
        );
        console.error('[BWC] form error:', err);
      } finally {
        if (button) { button.disabled = false; button.textContent = original; }
      }
    });
  }

  /* ============================================================== BOOT === */
  function boot() {
    initHeader();
    initLightbox();
    initForm();
    observeReveals();
    renderConditions();
    renderFees();
    renderFaqs();
    renderHours();

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
