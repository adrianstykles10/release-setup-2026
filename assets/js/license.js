// MIT gate → unlock download (opens direct release URL in new tab)

(() => {
  const box     = document.getElementById('license-box');
  const accept  = document.getElementById('accept');
  const btn     = document.getElementById('download-btn');
  const status  = document.getElementById('download-status');
  const hint    = document.getElementById('scroll-hint');

  if (!box || !accept || !btn) return;

  const releaseUrl = btn.dataset.href || '';

  let scrolledToEnd = false;

  const checkScroll = () => {
    const done = box.scrollTop + box.clientHeight >= box.scrollHeight - 8;
    if (done && !scrolledToEnd) {
      scrolledToEnd = true;
      accept.disabled = false;
      hint?.classList.remove('show');
      status.textContent = 'Accept the license to unlock';
    }
  };

  if (box.scrollHeight <= box.clientHeight + 8) {
    scrolledToEnd = true;
    accept.disabled = false;
    status.textContent = 'Accept the license to unlock';
  } else {
    accept.disabled = true;
    hint?.classList.add('show');
    status.textContent = 'Scroll the license to the end';
  }

  box.addEventListener('scroll', checkScroll);

  const enable = () => {
    btn.classList.remove('disabled');
    btn.removeAttribute('aria-disabled');
    if (releaseUrl) btn.setAttribute('href', releaseUrl);
    status.textContent = 'Ready — click to download';
    status.classList.add('ok');
  };

  const disable = () => {
    btn.classList.add('disabled');
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('href', '#');
    status.textContent = 'Accept the license to unlock';
    status.classList.remove('ok');
  };

  accept.addEventListener('change', () => {
    if (accept.checked && scrolledToEnd) enable(); else disable();
  });

  btn.addEventListener('click', (e) => {
    if (btn.classList.contains('disabled')) {
      e.preventDefault();
      accept.focus();
      return;
    }
    try { localStorage.setItem('mit-accepted', String(Date.now())); } catch {}
    status.textContent = 'Download started';
    status.classList.add('ok');
  });
})();
