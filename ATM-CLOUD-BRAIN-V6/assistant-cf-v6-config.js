/* =========================================================
   ATM CLOUD BRAIN V6 — FRONTEND CONFIG
   =========================================================
   1) Deploy the Cloudflare Worker.
   2) Paste its URL below.
   3) Create a Cloudflare Turnstile Managed widget and paste
      the PUBLIC sitekey below.
   NEVER put the Turnstile secret in this file.
*/
window.ATM_CLOUD_BRAIN = {
  endpoint: "PASTE_CLOUDFLARE_WORKER_URL_HERE",
  turnstileSitekey: "PASTE_TURNSTILE_SITEKEY_HERE",
  requireTurnstile: true
};
