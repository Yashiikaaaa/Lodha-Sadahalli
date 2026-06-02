/**
 * otp-verify.js
 *
 * Drop-in OTP verification for campaign lead forms.
 * Intercepts fetch calls to the leads endpoint, runs Firebase phone auth,
 * and injects otpToken + Authorization header automatically.
 *
 * Setup in index.html (before this script):
 *
 *   <script>
 *     window.__LEADS_CONFIG__ = {
 *       endpoint:    'https://your-leads-server.com/handleMultipleCampaignData',
 *       authToken:   'your-SERVER_AUTH_TOKEN',
 *       firebase: {
 *         apiKey:    'iqol-crm-web-api-key',
 *         authDomain:'iqol-crm.firebaseapp.com',
 *         projectId: 'iqol-crm',
 *       }
 *     };
 *   </script>
 *   <script type="module" src="/otp-verify.js"></script>
 */

import { initializeApp }        from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// ─── Config ──────────────────────────────────────────────────────────────────

const cfg = window.__LEADS_CONFIG__;

if (!cfg || !cfg.endpoint || !cfg.authToken || !cfg.firebase) {
  console.warn('[otp-verify] window.__LEADS_CONFIG__ is missing or incomplete. OTP verification disabled.');
}

// ─── Firebase init ────────────────────────────────────────────────────────────

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
  .__otp_overlay__ {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 99999;
    display: flex; align-items: center; justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .__otp_box__ {
    background: #fff; border-radius: 14px;
    padding: 32px 28px; width: 320px; max-width: 90vw;
    text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .__otp_box__ h3 {
    margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #111;
  }
  .__otp_box__ p {
    margin: 0 0 20px; font-size: 14px; color: #555;
  }
  .__otp_input__ {
    width: 100%; box-sizing: border-box;
    padding: 12px 14px; font-size: 20px; letter-spacing: 6px;
    border: 2px solid #ddd; border-radius: 8px;
    text-align: center; outline: none; transition: border 0.2s;
  }
  .__otp_input__:focus { border-color: #4f46e5; }
  .__otp_btn__ {
    margin-top: 14px; width: 100%; padding: 12px;
    background: #4f46e5; color: #fff; font-size: 15px; font-weight: 600;
    border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s;
  }
  .__otp_btn__:hover  { background: #4338ca; }
  .__otp_btn__:disabled { background: #a5b4fc; cursor: not-allowed; }
  .__otp_skip__ {
    display: block; margin-top: 12px; font-size: 13px;
    color: #888; cursor: pointer; text-decoration: underline;
    background: none; border: none;
  }
  .__otp_err__  { color: #dc2626; font-size: 13px; margin-top: 8px; }
  .__otp_resend__ { font-size: 13px; margin-top: 10px; color: #555; }
  .__otp_resend__ span { color: #4f46e5; cursor: pointer; font-weight: 500; }
`;
document.head.appendChild(style);

// ─── reCAPTCHA (invisible) ────────────────────────────────────────────────────

let recaptchaVerifier = null;

function ensureRecaptcha() {
  if (recaptchaVerifier) return recaptchaVerifier;

  // Always remove old container and create fresh to avoid "already rendered" error
  const old = document.getElementById('__otp_recaptcha__');
  if (old) old.remove();

  const container = document.createElement('div');
  container.id = '__otp_recaptcha__';
  document.body.appendChild(container);

  recaptchaVerifier = new RecaptchaVerifier(auth, '__otp_recaptcha__', { size: 'invisible' });
  return recaptchaVerifier;
}

// ─── OTP Modal ────────────────────────────────────────────────────────────────

function showOtpModal(phone, confirmFn) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = '__otp_overlay__';
    overlay.innerHTML = `
      <div class="__otp_box__">
        <h3>Verify Your Number</h3>
        <p>Enter the 6-digit OTP sent to<br><strong>${phone}</strong></p>
        <input class="__otp_input__" type="tel" maxlength="6" placeholder="------" autocomplete="one-time-code" />
        <div class="__otp_err__" style="display:none"></div>
        <button class="__otp_btn__">Verify</button>
        <div class="__otp_resend__">Didn't receive? <span>Resend OTP</span></div>
        <button class="__otp_skip__">Skip verification</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('.__otp_input__');
    const btn   = overlay.querySelector('.__otp_btn__');
    const errEl = overlay.querySelector('.__otp_err__');
    const skip  = overlay.querySelector('.__otp_skip__');

    input.focus();

    function close() { document.body.removeChild(overlay); }

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
    skip.addEventListener('click', () => { close(); resolve(null); });
  });
}

// ─── Core OTP flow ────────────────────────────────────────────────────────────

async function runOtpFlow(phone) {
  if (!auth) return null;

  // Normalise phone to E.164 (+91XXXXXXXXXX for India)
  let e164 = phone.replace(/\D/g, '');
  if (e164.length === 10) e164 = '+91' + e164;
  else if (!e164.startsWith('+')) e164 = '+' + e164;

  try {
    const verifier = ensureRecaptcha();
    const confirmation = await signInWithPhoneNumber(auth, e164, verifier);

    const token = await showOtpModal(phone, async (otp) => {
      const credential = await confirmation.confirm(otp);
      return await credential.user.getIdToken();
    });

    // Always clear reCAPTCHA after use so next submission gets a fresh one
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    return token;
  } catch (err) {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    console.warn('[otp-verify] Phone auth failed:', err.message);
    return null;
  }
}

// ─── Fetch interceptor ────────────────────────────────────────────────────────

if (cfg) {
  const _fetch = window.fetch.bind(window);

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;

    // Only intercept POST calls to the leads endpoint
    const isLeadCall = url && url.includes(cfg.endpoint) && (init.method || 'GET').toUpperCase() === 'POST';

    if (!isLeadCall) return _fetch(input, init);

    // Parse existing body
    let body = {};
    try {
      body = JSON.parse(init.body || '{}');
    } catch (_) {}

    // Run OTP flow if phone is present and no otpToken already set
    if (body.phoneNumber && !body.otpToken) {
      const token = await runOtpFlow(body.phoneNumber);
      if (token) body.otpToken = token;
    }

    // Always inject Authorization header
    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${cfg.authToken}`);
    headers.set('Content-Type', 'application/json');

    return _fetch(input, {
      ...init,
      headers,
      body: JSON.stringify(body),
    });
  };
}
