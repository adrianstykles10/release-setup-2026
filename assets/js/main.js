// nav highlight, copy buttons, OS tabs, "ago" / "next update", hash copy

(() => {
  // ---------- active nav link
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---------- terminal copy buttons
  document.querySelectorAll('.terminal').forEach(term => {
    const body = term.querySelector('.terminal-body');
    if (!body) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      const text = body.innerText.replace(/^(\$|PS>|>)\s?/gm, '').trim();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied';
        btn.classList.add('ok');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 1400);
      } catch {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
      }
    });
    body.appendChild(btn);
  });

  // ---------- OS tabs (windows / linux)
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  if (tabs.length) {
    const saved = localStorage.getItem('os-tab');
    const ua = navigator.userAgent.toLowerCase();
    let def = saved || (ua.includes('linux') && !ua.includes('android') ? 'linux' : 'windows');

    const activate = (name) => {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
      localStorage.setItem('os-tab', name);
    };

    if (![...tabs].some(t => t.dataset.tab === def)) def = tabs[0].dataset.tab;
    activate(def);

    tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));
  }

  // ---------- footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---------- humanize duration ("Xh Ymin", "Yd Xh", …)
  const humanAgo = (ms) => {
    const s = Math.max(0, Math.round(ms / 1000));
    if (s < 60)          return s + 's ago';
    const m = Math.round(s / 60);
    if (m < 60)          return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24)          return h + 'h' + (m % 60 ? ' ' + (m % 60) + 'm' : '') + ' ago';
    const d = Math.floor(h / 24);
    return d + 'd' + (h % 24 ? ' ' + (h % 24) + 'h' : '') + ' ago';
  };

  const humanIn = (ms) => {
    if (ms <= 0) return 'any moment';
    const s = Math.round(ms / 1000);
    const m = Math.round(s / 60);
    if (m < 60)          return 'in ' + m + 'm';
    const h = Math.floor(m / 60);
    return 'in ' + h + 'h' + (m % 60 ? ' ' + (m % 60) + 'm' : '');
  };

  // ---------- "pushed X ago" pill + "next update in Y"
  const pill = document.querySelector('.pill[data-updated]');
  const ago  = document.getElementById('ago');
  const next = document.getElementById('next-update');

  if (pill) {
    const updated = new Date(pill.dataset.updated).getTime();
    const cycleMs = 48 * 60 * 60 * 1000;

    const tick = () => {
      const now = Date.now();

      if (ago) ago.textContent = humanAgo(now - updated);

      if (next) {
        const cyclesPassed = Math.floor((now - updated) / cycleMs);
        const nextAt       = updated + (cyclesPassed + 1) * cycleMs;
        next.innerHTML     = humanIn(nextAt - now);
      }
    };
    tick();
    setInterval(tick, 30 * 1000);
  }

  // ---------- copy hash button
  const hashBtn = document.getElementById('copy-hash');
  const hashEl  = document.getElementById('file-hash');
  if (hashBtn && hashEl) {
    hashBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(hashEl.textContent.trim());
        hashBtn.textContent = 'Copied';
        hashBtn.classList.add('ok');
        setTimeout(() => { hashBtn.textContent = 'Copy'; hashBtn.classList.remove('ok'); }, 1400);
      } catch {
        hashBtn.textContent = 'Err';
        setTimeout(() => { hashBtn.textContent = 'Copy'; }, 1400);
      }
    });
  }
})();
