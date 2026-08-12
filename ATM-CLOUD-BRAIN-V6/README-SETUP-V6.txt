ATM CLOUD BRAIN V6 🍉🧠☁️
============================

Questa è la versione "compare cocomero con cervello vero" SENZA OpenAI API.

USA
---
Cloudflare Workers AI.

Modello intelligente:
  @cf/meta/llama-3.3-70b-instruct-fp8-fast

Modello veloce/economico per domande semplici:
  @cf/meta/llama-3.1-8b-instruct-fast

La V6 sceglie automaticamente:
- domanda semplice -> modello 8B veloce
- follow-up / perché / confronto / troubleshooting -> modello 70B

PROTEZIONI INCLUSE
------------------
✓ Cloudflare Turnstile Managed
✓ validazione Turnstile SERVER-SIDE
✓ sessione firmata HMAC valida 1 ora
✓ sessione legata all'IP che l'ha creata
✓ rate limit chat: 12 richieste/minuto per IP
✓ rate limit verifica: 4/minuto per IP
✓ CORS limitato al dominio GitHub Pages
✓ max 700 caratteri per domanda
✓ max 8 messaggi di cronologia
✓ max 420 token di risposta
✓ nessuna API key nel browser
✓ nessuna domanda viene loggata esplicitamente dal nostro codice
✓ fallback locale se Workers AI non è disponibile
✓ responsive con VisualViewport / tastiera mobile / safe-area iPhone

FILE
----
Frontend:
  assistant-cf-v6-config.js
  assistant-cf-v6.js

Backend:
  cloudflare-worker/worker.js
  cloudflare-worker/wrangler.toml

=========================================================
1. CLOUDFLARE TURNSTILE
=========================================================

Nel dashboard Cloudflare:
Turnstile -> Add widget

Nome:
  ATM Ecosystem Guide

Tipo:
  Managed

Hostname:
  stefano-dotcom.github.io

Prendi:
- SITEKEY (pubblica)
- SECRET KEY (privata)

La SITEKEY va nel file:
  assistant-cf-v6-config.js

La SECRET NON va MAI su GitHub.

=========================================================
2. DEPLOY WORKER CON WRANGLER
=========================================================

Serve Wrangler 4.36.0 o più recente per il Rate Limiting binding.

Dentro la cartella cloudflare-worker:

  npx wrangler login

Poi configura i due secret:

  npx wrangler secret put TURNSTILE_SECRET

incolla la SECRET Turnstile.

Poi:

  npx wrangler secret put SESSION_SECRET

Per SESSION_SECRET usa una stringa casuale molto lunga.
Puoi generarne una per esempio con:

  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

Infine:

  npx wrangler deploy

Wrangler ti darà un URL tipo:

  https://atm-cloud-brain.NOME.workers.dev

=========================================================
3. CONFIGURA IL FRONTEND
=========================================================

Apri assistant-cf-v6-config.js

Sostituisci:
  PASTE_CLOUDFLARE_WORKER_URL_HERE

con l'URL del Worker.

Poi sostituisci:
  PASTE_TURNSTILE_SITEKEY_HERE

con la SITEKEY pubblica Turnstile.

=========================================================
4. CARICA SU GITHUB
=========================================================

Metti nella ROOT del repository:

  assistant-cf-v6-config.js
  assistant-cf-v6.js

In:
  index.html
  atm-v7.html
  atm-bridge.html

rimuovi assistant-v4.js e qualsiasi assistant-ai-v5.js.

Mantieni assistant.js perché contiene la UI/animazioni WOW.

Ordine finale:

  <script src="assistant.js?v=20260812-wow3"></script>
  <script src="assistant-cf-v6-config.js?v=20260812-v6"></script>
  <script src="assistant-cf-v6.js?v=20260812-v6"></script>

=========================================================
5. TEST
=========================================================

Fai Ctrl+F5.

Conversazione di prova:

Cos'è ATM Bridge?
Perché non importare semplicemente il file a mano?
Quale vantaggio reale mi dà?
Tabs non è un permesso troppo invasivo?
Perché gli serve?
Ok, sono su Chrome: guidami passo passo.
E se sono da telefono?
Allora cosa mi consigli?
Dove entra Manager in tutto questo?
Confrontami i tre strumenti pensando a chi parte da zero.

Il bot deve mantenere il contesto e NON ripetere lo stesso paragrafo.

=========================================================
6. SE FINISCE LA QUOTA GRATIS
=========================================================

Il frontend mostra:
  "Abbiamo finito la quota AI gratuita di oggi"

e usa/mostra il fallback dove possibile.

Non devi mettere una carta OpenAI e non c'è alcuna OpenAI API key.

=========================================================
7. HEALTH CHECK
=========================================================

Apri:
  https://TUO-WORKER.workers.dev/health

Deve rispondere JSON con:
  ok: true
  ai: true
  turnstile: true

=========================================================
NOTA
=========================================================

Se vuoi testare temporaneamente senza Turnstile:
nel wrangler.toml puoi mettere:

  REQUIRE_TURNSTILE = "false"

ma per il sito pubblico consiglio di lasciarlo TRUE.
