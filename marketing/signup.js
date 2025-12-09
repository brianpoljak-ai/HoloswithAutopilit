/*
  HolosCX marketing signup helper

  - Intercepts `form[name="holoscx-signup"]` and `form[name="holoscx-enterprise-quote"]`
  - Sends JSON to the backend endpoint configured by:
    1. window.HOLOS_BACKEND_URL (highest priority)
    2. import.meta.env.VITE_BACKEND_URL (if using Vite)
    3. process.env.VITE_BACKEND_URL (fallback)
  - Prevents Netlify default form handling so this becomes a simple JS POST flow

  Usage: include this script on the marketing pages (before </body>):
    <script src="/path/to/signup.js"></script>

  For local testing, set window.HOLOS_BACKEND_URL before loading the script:
    <script>window.HOLOS_BACKEND_URL='http://localhost:5000'</script>
    <script src="/path/to/signup.js"></script>

  This file is intentionally tiny and defensive: it falls back to the form's
  `action` if the backend is not configured.
*/

(function () {
  // Resolve backend URL from multiple sources
  const BACKEND_URL = 
    window.HOLOS_BACKEND_URL || 
    (typeof import?.meta?.env?.VITE_BACKEND_URL !== 'undefined' ? import.meta.env.VITE_BACKEND_URL : null) ||
    (typeof process?.env?.VITE_BACKEND_URL !== 'undefined' ? process.env.VITE_BACKEND_URL : null) ||
    'https://holos-autopilot-lvfxjikhp-brianpoljak-ais-projects.vercel.app';

  function serializeForm(form) {
    const data = {};
    new FormData(form).forEach((v, k) => {
      data[k] = v;
    });
    return data;
  }

  async function submitToBackend(form, endpoint) {
    const payload = serializeForm(form);

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit'
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Signup submit failed:', res.status, txt);
        return { ok: false, status: res.status, body: txt };
      }

      const json = await res.json();
      return { ok: true, json };
    } catch (err) {
      console.error('Signup submit unexpected error:', err);
      return { ok: false, error: String(err) };
    }
  }

  function attach(formName, endpoint) {
    const form = document.querySelector(`form[name="${formName}"]`);
    if (!form) return;

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      // small UX lock
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const result = await submitToBackend(form, endpoint);

      if (submitBtn) submitBtn.disabled = false;

      if (result.ok) {
        // backend returns { workspaceLink } on success
        const link = result.json?.workspaceLink;
        if (link) {
          // redirect user to workspace link (or show a success message)
          window.location.href = link;
          return;
        }
        // fallback: show a simple success notice and reset form
        alert('Workspace created. Check your email for onboarding steps.');
        form.reset();
      } else {
        // fallback: if form has an action, submit the native way
        if (form.action) {
          form.submit();
        } else {
          alert('There was a problem creating your workspace. Please try again or contact support.');
        }
      }
    });
  }

  // Attach handlers for the two marketing forms
  document.addEventListener('DOMContentLoaded', () => {
    attach('holoscx-signup', '/api/workspaces');
    attach('holoscx-enterprise-quote', '/api/enterprise-quote');
  });
})();
