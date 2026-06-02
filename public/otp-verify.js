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

// ─── Config ───────────────────────────────────────────────────────────────────

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
  .__otp_dark_overlay__ {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 99998;
  }
  .__otp_modal_wrap__ {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .__otp_modal_inner__ {
    background: #fff;
    width: 100%; max-width: 56rem;
    height: 60vh;
    display: flex; gap: 0;
    align-items: stretch; justify-content: space-between;
    border: 1px solid #e5e7eb;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    overflow: hidden;
    margin: 0 auto;
  }
  .__otp_left_img__ {
    display: none;
    width: 50%; height: 100%;
    object-fit: cover; flex: 1; flex-shrink: 0;
  }
  @media (min-width: 768px) {
    .__otp_left_img__ { display: block; }
    .__otp_modal_wrap__ { top: 0; align-items: center; }
  }
  .__otp_right__ {
    flex: 1;
    padding: 0 1.5rem;
    height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 0.75rem;
    position: relative;
  }
  .__otp_close_btn__ {
    position: absolute; top: 0.5rem; right: 0.5rem;
    background: #fff; border: none; font-size: 1.5rem;
    cursor: pointer; line-height: 1; padding: 4px 8px;
    color: #333;
  }
  .__otp_heading__ {
    font-size: 1.5rem; font-weight: 600;
    text-align: center; margin: 0;
    color: #111; line-height: 1.3;
  }
  .__otp_sub__ {
    font-size: 0.95rem; color: #555;
    text-align: center; margin: 0;
  }
  .__otp_input__ {
    width: 100%; max-width: 20rem; box-sizing: border-box;
    padding: 1rem; font-size: 1.5rem; letter-spacing: 0.5rem;
    border: 1px solid #6b7280; border-radius: 2px;
    text-align: center; outline: none;
    transition: border-color 0.2s;
  }
  .__otp_input__:focus { border-color: #111; }
  .__otp_err__ {
    color: #dc2626; font-size: 0.85rem;
    margin: 0; text-align: center;
  }
  .__otp_btn__ {
    width: 100%; max-width: 20rem; padding: 0.6rem 1rem;
    color: #fff; font-size: 1rem; font-weight: 600;
    border: none; cursor: pointer;
    transition: opacity 0.2s;
  }
  .__otp_btn__:disabled { opacity: 0.5; cursor: not-allowed; }
  .__otp_resend__ {
    font-size: 0.85rem; color: #555;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .__otp_resend_divider__ {
    height: 2px; width: 5.375rem; background: #D9D9D9;
  }
  .__otp_resend_span__ {
    cursor: pointer; font-weight: 500;
  }
  .__otp_skip__ {
    font-size: 0.8rem; color: #888;
    cursor: pointer; text-decoration: underline;
    background: none; border: none; padding: 0;
  }
`;
document.head.appendChild(style);

// ─── reCAPTCHA (invisible) ────────────────────────────────────────────────────

let recaptchaVerifier = null;

function ensureRecaptcha() {
  if (recaptchaVerifier) return recaptchaVerifier;

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

    // Grab image src and button color from the open contact form
    const formImg = document.querySelector('img[src*="assets"]');
    const imgSrc  = formImg?.src || '';
    const formBtn = document.querySelector('.bg-PrestigeBrown, button[class*="PrestigeBrown"]');
    const btnColor = formBtn ? getComputedStyle(formBtn).backgroundColor : '#8B6914';

    // Dark overlay
    const darkOverlay = document.createElement('div');
    darkOverlay.className = '__otp_dark_overlay__';
    document.body.appendChild(darkOverlay);

    // Modal wrapper
    const wrap = document.createElement('div');
    wrap.className = '__otp_modal_wrap__';
    wrap.innerHTML = `
      <div class="__otp_modal_inner__">
        ${imgSrc ? `<img class="__otp_left_img__" src="${imgSrc}" alt="" />` : ''}
        <div class="__otp_right__">
          <button class="__otp_close_btn__">&#10005;</button>
          <div class="__otp_heading__">Verify Your Number</div>
          <p class="__otp_sub__">Enter the 6-digit OTP sent to<br><strong>${phone}</strong></p>
          <input class="__otp_input__" type="tel" maxlength="6" placeholder="------" autocomplete="one-time-code" />
          <div class="__otp_err__" style="display:none;"></div>
          <button class="__otp_btn__" style="background:${btnColor};">Verify</button>
          <div class="__otp_resend__">
            <div class="__otp_resend_divider__"></div>
            <span class="__otp_resend_span__">Resend OTP</span>
            <div class="__otp_resend_divider__"></div>
          </div>
          <button class="__otp_skip__">Skip verification</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const input     = wrap.querySelector('.__otp_input__');
    const btn       = wrap.querySelector('.__otp_btn__');
    const errEl     = wrap.querySelector('.__otp_err__');
    const skip      = wrap.querySelector('.__otp_skip__');
    const closeBtn  = wrap.querySelector('.__otp_close_btn__');

    input.focus();

    function close() {
      document.body.removeChild(wrap);
      document.body.removeChild(darkOverlay);
    }

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
    closeBtn.addEventListener('click', () => { close(); resolve(null); });
    skip.addEventListener('click', () => { close(); resolve(null); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleVerify(); });
  });
}

// ─── Core OTP flow ────────────────────────────────────────────────────────────

async function runOtpFlow(phone) {
  if (!auth) return null;

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

    const isLeadCall = url && url.includes(cfg.endpoint) && (init.method || 'GET').toUpperCase() === 'POST';

    if (!isLeadCall) return _fetch(input, init);

    let body = {};
    try {
      body = JSON.parse(init.body || '{}');
    } catch (_) {}

    if (body.phoneNumber && !body.otpToken) {
      const token = await runOtpFlow(body.phoneNumber);
      if (token) body.otpToken = token;
    }

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
