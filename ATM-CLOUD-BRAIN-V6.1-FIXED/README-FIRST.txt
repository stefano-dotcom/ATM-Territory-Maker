ATM CLOUD BRAIN — V6.1 FIXED
=============================

HO CONTROLLATO IL REPOSITORY PUBBLICATO.

Il problema attuale è questo:

1) La home `index.html` carica soltanto:
   assistant.js

   Quindi stai usando ancora il vecchio motore locale.

2) Hai caricato la V6 dentro:
   ATM-CLOUD-BRAIN-V6/

   ma le pagine non la caricano.

3) La config V6 contiene ancora:
   PASTE_CLOUDFLARE_WORKER_URL_HERE
   PASTE_TURNSTILE_SITEKEY_HERE

   quindi Cloud AI non è ancora configurata.

4) Alcuni video vengono ancora richiesti come:
   assets/ai-animation-flow-1.mp4
   assets/atm-v7-intro.mp4

   ma i file reali sono nella ROOT.

COSA FA QUESTO PACCHETTO
------------------------
- responsive forzato per telefono/tablet/landscape;
- usa 100dvh + VisualViewport quando la tastiera mobile si apre;
- supporta safe-area iPhone;
- niente testo che esce dai bubble;
- input 16px su iPhone (niente zoom automatico);
- chips orizzontali scrollabili;
- icona AI nascosta realmente quando la chat è aperta;
- badge chiaro LOCAL MODE / CLOUD AI;
- ripara anche i vecchi path video dopo il caricamento.

INSTALLAZIONE FRONTEND
----------------------
COPIA NELLA ROOT del repository:

  assistant-mobile-v6-1.css
  assistant-cf-v6-config.js
  assistant-cf-v6-1-bootstrap.js
  assistant-cf-v6.js

NON dentro una cartella.

HEAD di index.html, atm-v7.html e atm-bridge.html:

Dopo assistant.css aggiungi:

  <link rel="stylesheet" href="assistant-mobile-v6-1.css?v=20260812-2">

In fondo alla pagina usa questo ordine:

  <script src="assistant.js?v=20260812-wow3"></script>
  <script src="assistant-cf-v6-config.js?v=20260812-2"></script>
  <script src="assistant-cf-v6-1-bootstrap.js?v=20260812-2"></script>
  <script src="assistant-cf-v6.js?v=20260812-2"></script>

RIMUOVI dalle pagine:
  assistant-v4.js
  assistant-ai-v5.js
  assistant-v5-config.js

MEDIA PATH FIX
--------------
In index.html sostituisci OGNI:

  assets/ai-animation-flow-1.mp4

con:

  ai-animation-flow-1.mp4

e OGNI:

  assets/atm-v7-intro.mp4

con:

  atm-v7-intro.mp4

Questo elimina i 404 invece di limitarci a correggerli dopo.

ATTIVARE DAVVERO CLOUD AI
-------------------------
Il responsive funziona anche senza Cloudflare.

Per l'intelligenza vera devi però:
1. deployare il Worker nella cartella cloudflare-worker;
2. creare Turnstile;
3. mettere URL Worker e SITEKEY in assistant-cf-v6-config.js.

Finché non lo fai, nella testata della chat vedrai:
  LOCAL MODE · Cloud Brain non configurato

Quando è tutto configurato deve apparire:
  Cloudflare AI · sessione protetta

TEST RESPONSIVE
---------------
Chrome DevTools:
  iPhone 14 Pro Max — 430x932
  iPhone SE
  iPad Mini
  landscape 844x390

La chat deve occupare ESATTAMENTE il viewport su telefono,
senza essere tagliata a destra.

TEST ENGINE
-----------
Apri DevTools -> Network e manda una domanda.

Se Cloud AI funziona devi vedere richieste:
  /session
  /chat

Se NON compaiono, stai ancora usando il motore locale.
