/**
 * otp-verify.js — Drop-in OTP verification for campaign lead forms.
 *
 * Setup in index.html (before this script):
 *   <script>
 *     window.__LEADS_CONFIG__ = {
 *       endpoint:  'https://your-server.com/handleMultipleCampaignData',
 *       authToken: 'your-SERVER_AUTH_TOKEN',
 *       firebase: { apiKey: '...', authDomain: 'iqol-crm.firebaseapp.com', projectId: 'iqol-crm' }
 *     };
 *   </script>
 *   <script type="module" src="/otp-verify.js?v=3"></script>
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const cfg = window.__LEADS_CONFIG__;
if (!cfg || !cfg.endpoint || !cfg.authToken || !cfg.firebase) {
  console.warn('[otp-verify] __LEADS_CONFIG__ missing or incomplete.');
}

let auth = null;
if (cfg?.firebase) {
  try {
    const app = initializeApp(cfg.firebase, 'otp-verify');
    auth = getAuth(app);
  } catch (e) {
    console.error('[otp-verify] Firebase init failed:', e);
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const style = document.createElement('style');
style.textContent = `
  .__otp_dark_overlay__ {
    position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:99998;
  }
  .__otp_modal_wrap__ {
    position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
    z-index:99999; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  }
  .__otp_modal_inner__ {
    background:#fff; width:100%; max-width:54rem; height:58vh;
    display:flex; gap:0; align-items:stretch;
    border:1px solid #e5e7eb; box-shadow:0 20px 60px rgba(0,0,0,0.3);
    overflow:hidden; margin:0 1rem;
  }
  .__otp_left_img__ {
    display:none; flex:1; object-fit:cover;
  }
  @media(min-width:768px){ .__otp_left_img__{ display:block; } }
  .__otp_right__ {
    flex:1; padding:0 2rem; height:100%;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:0.75rem; position:relative;
  }
  .__otp_close_btn__ {
    position:absolute; top:0.5rem; right:0.5rem;
    background:#fff; border:none; font-size:1.4rem;
    cursor:pointer; color:#333; padding:4px 8px; line-height:1;
  }
  .__otp_heading__ {
    font-size:1.4rem; font-weight:600; text-align:center; margin:0; color:#111;
  }
  .__otp_sub__ {
    font-size:0.9rem; color:#555; text-align:center; margin:0;
    display:flex; align-items:center; justify-content:center; gap:0.4rem; flex-wrap:wrap;
  }
  .__otp_pencil_btn__ {
    background:none; border:none; cursor:pointer; font-size:0.85rem;
    color:#555; padding:2px 4px; line-height:1;
  }
  .__otp_pencil_btn__:hover { color:#111; }
  .__otp_input__ {
    width:100%; max-width:18rem; box-sizing:border-box;
    padding:0.9rem; font-size:1.5rem; letter-spacing:0.5rem;
    border:1px solid #6b7280; border-radius:2px;
    text-align:center; outline:none; transition:border-color 0.2s;
  }
  .__otp_input__:focus { border-color:#111; }
  .__otp_err__ { color:#dc2626; font-size:0.82rem; margin:0; text-align:center; }
  .__otp_btn__ {
    width:100%; max-width:18rem; padding:0.6rem 1rem;
    color:#fff; font-size:1rem; font-weight:600;
    border:none; cursor:pointer; transition:opacity 0.2s;
  }
  .__otp_btn__:disabled { opacity:0.5; cursor:not-allowed; }
  .__otp_timer__ { font-size:0.82rem; color:#888; text-align:center; }
  .__otp_timer__.active { color:#4f46e5; cursor:pointer; font-weight:500; }
  .__otp_loading_wrap__ {
    position:fixed; inset:0; background:rgba(0,0,0,0.8);
    z-index:99998; display:flex; align-items:center; justify-content:center;
  }
  .__otp_spinner__ {
    width:44px; height:44px;
    border:4px solid rgba(255,255,255,0.25);
    border-top-color:#fff;
    border-radius:50%;
    animation:__otp_spin__ 0.8s linear infinite;
  }
  @keyframes __otp_spin__ { to { transform:rotate(360deg); } }
`;
document.head.appendChild(style);

// ─── reCAPTCHA ────────────────────────────────────────────────────────────────

let recaptchaVerifier = null;

function ensureRecaptcha() {
  if (recaptchaVerifier) return recaptchaVerifier;
  const old = document.getElementById('__otp_recaptcha__');
  if (old) old.remove();
  const el = document.createElement('div');
  el.id = '__otp_recaptcha__';
  document.body.appendChild(el);
  recaptchaVerifier = new RecaptchaVerifier(auth, '__otp_recaptcha__', { size: 'invisible' });
  return recaptchaVerifier;
}

function clearRecaptcha() {
  if (recaptchaVerifier) { recaptchaVerifier.clear(); recaptchaVerifier = null; }
}

// ─── Loading overlay ─────────────────────────────────────────────────────────

function showLoadingOverlay() {
  const el = document.createElement('div');
  el.className = '__otp_loading_wrap__';
  el.innerHTML = '<div class="__otp_spinner__"></div>';
  document.body.appendChild(el);
  return () => { if (el.parentNode) el.parentNode.removeChild(el); };
}

// ─── OTP Modal ────────────────────────────────────────────────────────────────

function showOtpModal(phone, imgSrc, btnColor, confirmFn, resendFn) {
  return new Promise((resolve) => {

    const darkOverlay = document.createElement('div');
    darkOverlay.className = '__otp_dark_overlay__';
    document.body.appendChild(darkOverlay);

    const wrap = document.createElement('div');
    wrap.className = '__otp_modal_wrap__';
    wrap.innerHTML = `
      <div class="__otp_modal_inner__">
        ${imgSrc ? `<img class="__otp_left_img__" src="${imgSrc}" alt="" />` : ''}
        <div class="__otp_right__">
          <button class="__otp_close_btn__">&#10005;</button>
          <div class="__otp_heading__">Verify Your Number</div>
          <p class="__otp_sub__">
            OTP sent to <strong>${phone}</strong>
            <button class="__otp_pencil_btn__" title="Edit phone number">&#9998;</button>
          </p>
          <input class="__otp_input__" type="tel" maxlength="6" placeholder="------" autocomplete="one-time-code" />
          <div class="__otp_err__" style="display:none;"></div>
          <button class="__otp_btn__" style="background:${btnColor};">Verify</button>
          <div class="__otp_timer__">Resend OTP in 45s</div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const input      = wrap.querySelector('.__otp_input__');
    const btn        = wrap.querySelector('.__otp_btn__');
    const errEl      = wrap.querySelector('.__otp_err__');
    const timerEl    = wrap.querySelector('.__otp_timer__');
    const closeBtn   = wrap.querySelector('.__otp_close_btn__');
    const pencilBtn  = wrap.querySelector('.__otp_pencil_btn__');

    input.focus();

    // ── Resend timer ──
    let timerSecs = 45;
    let timerInterval = setInterval(() => {
      timerSecs--;
      if (timerSecs <= 0) {
        clearInterval(timerInterval);
        timerEl.textContent = 'Resend OTP';
        timerEl.classList.add('active');
      } else {
        timerEl.textContent = `Resend OTP in ${timerSecs}s`;
      }
    }, 1000);

    timerEl.addEventListener('click', async () => {
      if (!timerEl.classList.contains('active')) return;
      timerEl.textContent = 'Sending...';
      timerEl.classList.remove('active');
      try {
        await resendFn();
        timerSecs = 45;
        timerEl.textContent = `Resend OTP in ${timerSecs}s`;
        timerInterval = setInterval(() => {
          timerSecs--;
          if (timerSecs <= 0) {
            clearInterval(timerInterval);
            timerEl.textContent = 'Resend OTP';
            timerEl.classList.add('active');
          } else {
            timerEl.textContent = `Resend OTP in ${timerSecs}s`;
          }
        }, 1000);
        input.value = '';
        input.focus();
      } catch {
        timerEl.textContent = 'Failed. Try again.';
        timerEl.classList.add('active');
      }
    });

    // ── Close / cleanup ──
    function close() {
      clearInterval(timerInterval);
      document.body.removeChild(wrap);
      document.body.removeChild(darkOverlay);
    }

    // ── Verify ──
    async function handleVerify() {
      const otp = input.value.trim();
      if (!otp) return;
      btn.disabled = true;
      btn.textContent = 'Verifying...';
      errEl.style.display = 'none';
      try {
        const token = await confirmFn(otp);
        close();
        resolve(token);
      } catch {
        btn.disabled = false;
        btn.textContent = 'Verify';
        errEl.textContent = 'Incorrect OTP, please try again.';
        errEl.style.display = 'block';
      }
    }

    btn.addEventListener('click', handleVerify);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleVerify(); });
    closeBtn.addEventListener('click', () => { close(); resolve(null); });
    // Pencil — close OTP modal, contact form is revealed behind
    pencilBtn.addEventListener('click', () => { close(); resolve(null); });
  });
}

// ─── Core OTP flow ────────────────────────────────────────────────────────────

async function runOtpFlow(phone, imgSrc, btnColor) {
  if (!auth) return null;

  let e164 = phone.replace(/\D/g, '');
  if (e164.length === 10) e164 = '+91' + e164;
  else if (!e164.startsWith('+')) e164 = '+' + e164;

  let confirmation = null;

  async function sendOtp() {
    clearRecaptcha();
    confirmation = await signInWithPhoneNumber(auth, e164, ensureRecaptcha());
  }

  const hideLoading = showLoadingOverlay();

  try {
    await sendOtp();
    hideLoading();

    const token = await showOtpModal(
      phone, imgSrc, btnColor,
      async (otp) => {
        const cred = await confirmation.confirm(otp);
        return await cred.user.getIdToken();
      },
      async () => { await sendOtp(); }  // resendFn
    );

    clearRecaptcha();
    return token;
  } catch (err) {
    hideLoading();
    clearRecaptcha();
    console.warn('[otp-verify] Phone auth failed:', err.message);
    return null;
  }
}

// ─── Fetch interceptor ────────────────────────────────────────────────────────

if (cfg) {
  const _fetch = window.fetch.bind(window);

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const isLeadCall = url && url.includes(cfg.endpoint) && (init.method || 'GET').toUpperCase() === 'POST';
    if (!isLeadCall) return _fetch(input, init);

    let body = {};
    try { body = JSON.parse(init.body || '{}'); } catch (_) {}

    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${cfg.authToken}`);
    headers.set('Content-Type', 'application/json');

    // Capture image & button color NOW while form is still open
    const formImg = document.querySelector('img[src*="assets"]');
    const capturedImg = formImg?.src || '';
    const formBtn = document.querySelector('.bg-PrestigeBrown, button[class*="PrestigeBrown"]');
    const capturedColor = formBtn ? getComputedStyle(formBtn).backgroundColor : '#8B6914';

    // 1. Save lead immediately — React gets response right away, form closes
    const response = await _fetch(input, { ...init, headers, body: JSON.stringify(body) });

    // 2. OTP runs completely independently AFTER lead saved — does NOT block form
    if (body.phoneNumber && response.ok) {
      runOtpFlow(body.phoneNumber, capturedImg, capturedColor).then(otpToken => {
        if (otpToken) {
          _fetch(cfg.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...body, otpToken }),
          }).catch(() => {});
        }
      });
    }

    return response;
  };
}
